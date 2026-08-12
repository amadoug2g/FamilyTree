import Link from "next/link";
import { isEditor } from "@/lib/auth";
import { buildFamilyTree, findTreeNode } from "@/lib/tree";
import { FamilyTree } from "@/components/FamilyTree";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ racine?: string }>;
}) {
  const { racine } = await searchParams;
  const [tree, canEdit] = await Promise.all([buildFamilyTree(), isEditor()]);

  const focusNode = racine ? findTreeNode(tree, racine) : null;
  const displayedNode = focusNode ?? tree.root;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">L&apos;arbre de la famille</h1>
          <p className="mt-1 text-sm text-muted">
            Qui descend de qui, qui a épousé qui. Clique sur + / − pour déplier
            une branche, sur un nom pour ouvrir sa fiche.
          </p>
        </div>
        {canEdit && (
          <Link
            href="/people/new"
            className="flex-none rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
          >
            + Ajouter une personne
          </Link>
        )}
      </div>

      {focusNode && (
        <Link href="/" className="mt-4 inline-block text-sm text-accent hover:underline">
          ← Retour à l&apos;arbre complet
        </Link>
      )}

      <div className="mt-8">
        {displayedNode ? (
          <FamilyTree node={displayedNode} />
        ) : (
          <p className="text-sm text-muted">Aucune personne enregistrée pour l&apos;instant.</p>
        )}
      </div>

      {!focusNode && tree.otherBranches.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-muted">Autres branches</h2>
          <p className="mt-1 text-xs text-muted">
            Personnes sans lien de parenté ou d&apos;union connu vers l&apos;arbre principal.
          </p>
          <div className="mt-4 space-y-4">
            {tree.otherBranches.map((branch) => (
              <FamilyTree key={branch.person.id} node={branch} />
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-xs text-muted">
        <Link href="/people" className="hover:text-accent">
          Voir l&apos;index alphabétique
        </Link>
      </p>
    </div>
  );
}
