import { prisma } from "@/lib/prisma";
import { displayName } from "@/lib/display";

type ParentType = "FATHER" | "MOTHER" | "GUARDIAN";

export type TreePersonSummary = {
  id: string;
  name: string;
  gender: string;
  isDeceased: boolean;
  profilePhotoUrl: string | null;
};

export type SpouseSummary = TreePersonSummary & { unionId: string };

export type TreeNode = {
  person: TreePersonSummary;
  spouses: SpouseSummary[];
  children: TreeNode[];
  descendantCount: number;
};

export type FamilyTreeData = {
  root: TreeNode | null;
  otherBranches: TreeNode[];
};

// Ordre de priorite pour choisir le parent d'affichage d'un enfant quand
// plusieurs sont connus (regle A1.1 du plan) : pere, puis mere, puis tuteur.
const PARENT_TYPE_PRIORITY: ParentType[] = ["FATHER", "MOTHER", "GUARDIAN"];

/**
 * Construit l'arbre genealogique complet en memoire, en 3 requetes a plat
 * (personnes, parentages, unions). Chaque personne apparait exactement une
 * fois dans l'arbre : soit comme noeud (rattachee a son parent d'affichage),
 * soit comme conjoint(e) d'un noeud. Les personnes sans parent et sans
 * conjoint rattache constituent des branches separees ("autres branches").
 */
export async function buildFamilyTree(): Promise<FamilyTreeData> {
  const [people, parentages, unions] = await Promise.all([
    prisma.person.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
        isDeceased: true,
        photos: { where: { isProfile: true }, take: 1, select: { url: true } },
      },
    }),
    prisma.parentage.findMany({ select: { parentId: true, childId: true, parentType: true } }),
    prisma.union.findMany({ select: { id: true, personAId: true, personBId: true } }),
  ]);

  const personById = new Map(people.map((p) => [p.id, p]));

  function toSummary(id: string): TreePersonSummary {
    const p = personById.get(id);
    if (!p) throw new Error(`Personne introuvable dans l'arbre: ${id}`);
    return {
      id: p.id,
      name: displayName(p),
      gender: p.gender,
      isDeceased: p.isDeceased,
      profilePhotoUrl: p.photos[0]?.url ?? null,
    };
  }

  // Tous les parents connus par enfant (avant de choisir le parent d'affichage).
  const parentsByChild = new Map<string, { parentId: string; parentType: ParentType }[]>();
  for (const pa of parentages) {
    const list = parentsByChild.get(pa.childId) ?? [];
    list.push({ parentId: pa.parentId, parentType: pa.parentType as ParentType });
    parentsByChild.set(pa.childId, list);
  }

  // Un parent est "rattache" s'il a lui-meme un parent connu : il finira donc
  // rattache a la racine par sa propre branche. Un conjoint entre par
  // alliance (ex: le mari d'une fille de la lignee) n'a lui-meme aucun
  // parent connu : le choisir comme parent d'affichage rendrait ses enfants
  // inaccessibles (son propre noeud n'existe que comme conjoint, sans slot
  // pour ses enfants). On privilegie donc, parmi les parents connus d'un
  // enfant, celui qui est rattache — et seulement ensuite pere > mere > tuteur.
  const isRattache = new Set(parentsByChild.keys());

  // Parent d'affichage unique par enfant : evite qu'une personne avec ses
  // deux parents connus (25 cas sur 117 dans les donnees maternelles)
  // n'apparaisse en double dans l'arbre.
  const displayParentOf = new Map<string, string>();
  for (const [childId, parents] of parentsByChild) {
    const sorted = [...parents].sort((a, b) => {
      const rattacheDiff = Number(isRattache.has(b.parentId)) - Number(isRattache.has(a.parentId));
      if (rattacheDiff !== 0) return rattacheDiff;
      return PARENT_TYPE_PRIORITY.indexOf(a.parentType) - PARENT_TYPE_PRIORITY.indexOf(b.parentType);
    });
    displayParentOf.set(childId, sorted[0].parentId);
  }

  const childrenOf = new Map<string, string[]>();
  for (const [childId, parentId] of displayParentOf) {
    const list = childrenOf.get(parentId) ?? [];
    list.push(childId);
    childrenOf.set(parentId, list);
  }

  // Unions dans les deux sens, pour retrouver facilement les conjoint(e)s.
  const spousesOf = new Map<string, { spouseId: string; unionId: string }[]>();
  for (const u of unions) {
    const pairs: [string, string][] = [
      [u.personAId, u.personBId],
      [u.personBId, u.personAId],
    ];
    for (const [a, b] of pairs) {
      const list = spousesOf.get(a) ?? [];
      list.push({ spouseId: b, unionId: u.id });
      spousesOf.set(a, list);
    }
  }

  const hasParent = new Set(displayParentOf.keys());
  const noParentIds = people.map((p) => p.id).filter((id) => !hasParent.has(id));

  // Personnes entrees par alliance : sans parent connu, mais conjointes de
  // quelqu'un qui, lui, a un parent dans l'arbre (regle A1.3). Elles ne
  // deviennent pas des racines separees.
  const spouseAttachedTo = new Map<string, string>();
  for (const id of noParentIds) {
    const attach = (spousesOf.get(id) ?? []).find((s) => hasParent.has(s.spouseId));
    if (attach) spouseAttachedTo.set(id, attach.spouseId);
  }

  const descendantCountCache = new Map<string, number>();
  function countDescendants(id: string): number {
    const cached = descendantCountCache.get(id);
    if (cached !== undefined) return cached;
    const total = (childrenOf.get(id) ?? []).reduce(
      (sum, childId) => sum + 1 + countDescendants(childId),
      0
    );
    descendantCountCache.set(id, total);
    return total;
  }

  function spousesFor(id: string): SpouseSummary[] {
    return (spousesOf.get(id) ?? []).map((s) => ({ ...toSummary(s.spouseId), unionId: s.unionId }));
  }

  function buildNode(id: string): TreeNode {
    const children = (childrenOf.get(id) ?? [])
      .map(buildNode)
      .sort((a, b) => a.person.name.localeCompare(b.person.name, "fr"));
    return {
      person: toSummary(id),
      spouses: spousesFor(id),
      children,
      descendantCount: countDescendants(id),
    };
  }

  // Racines veritables : sans parent ET sans conjoint rattache. La racine
  // principale est celle qui a le plus de descendants ; les autres (s'il y
  // en a) forment des branches separees affichees a part.
  const trueRootIds = noParentIds.filter((id) => !spouseAttachedTo.has(id));
  trueRootIds.sort((a, b) => countDescendants(b) - countDescendants(a));
  const [rootId, ...otherRootIds] = trueRootIds;

  return {
    root: rootId ? buildNode(rootId) : null,
    otherBranches: otherRootIds.map(buildNode),
  };
}

/** Cherche un noeud par id d'personne dans l'arbre deja construit. */
export function findTreeNode(tree: FamilyTreeData, personId: string): TreeNode | null {
  function search(node: TreeNode): TreeNode | null {
    if (node.person.id === personId) return node;
    for (const child of node.children) {
      const found = search(child);
      if (found) return found;
    }
    return null;
  }
  if (tree.root) {
    const found = search(tree.root);
    if (found) return found;
  }
  for (const branch of tree.otherBranches) {
    const found = search(branch);
    if (found) return found;
  }
  return null;
}
