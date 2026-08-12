import { displayName } from "@/lib/display";

type PersonLite = { id: string; firstName: string; lastName: string | null };

type ChildOfEntry = {
  parentType: string;
  parent: PersonLite & { parentOf: { child: PersonLite }[] };
};

type ParentOfEntry = {
  id: string;
  parentType: string;
  child: PersonLite & { childOf: { parent: PersonLite }[] };
};

/**
 * Fratrie d'une personne : toute personne partageant au moins un parent,
 * deduite (jamais stockee). A partir de childOf -> parent -> parentOf.
 */
export function computeSiblings(childOf: ChildOfEntry[], selfId: string): PersonLite[] {
  const seen = new Map<string, PersonLite>();
  for (const co of childOf) {
    for (const po of co.parent.parentOf) {
      if (po.child.id !== selfId) seen.set(po.child.id, po.child);
    }
  }
  return [...seen.values()].sort((a, b) => displayName(a).localeCompare(displayName(b), "fr"));
}

export type ChildrenGroup = {
  coParent: PersonLite | null;
  children: { id: string; parentType: string; child: PersonLite }[];
};

/**
 * Les enfants d'une personne, groupes par l'autre parent connu (utile pour
 * les familles polygames). Un groupe avec coParent=null rassemble les
 * enfants dont aucun autre parent n'est enregistre.
 */
export function computeChildrenGroups(parentOf: ParentOfEntry[], selfId: string): ChildrenGroup[] {
  const groups = new Map<string, ChildrenGroup>();
  for (const po of parentOf) {
    const others = po.child.childOf.map((c) => c.parent).filter((p) => p.id !== selfId);
    const coParent = others[0] ?? null;
    const key = coParent?.id ?? "__none__";
    const group = groups.get(key) ?? { coParent, children: [] };
    group.children.push({ id: po.id, parentType: po.parentType, child: po.child });
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => {
    if (!a.coParent) return 1;
    if (!b.coParent) return -1;
    return displayName(a.coParent).localeCompare(displayName(b.coParent), "fr");
  });
}
