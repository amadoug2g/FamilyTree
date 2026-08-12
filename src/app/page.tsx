import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const peopleCount = await prisma.person.count();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        La memoire de notre famille, preservee et partagee
      </h1>
      <p className="mt-4 text-lg text-muted">
        Ce site retrace l&apos;arbre genealogique de notre famille peulh
        senegalaise : qui descend de qui, qui a epouse qui, mais aussi
        l&apos;histoire de chacun &mdash; sa biographie, ses photos, les
        souvenirs que la famille garde de lui ou d&apos;elle.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/people"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Parcourir les membres
        </Link>
        <Link
          href="/people/new"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-surface"
        >
          Ajouter une personne
        </Link>
      </div>

      <p className="mt-10 text-sm text-muted">
        {peopleCount === 0
          ? "Aucune personne enregistree pour l'instant : c'est le moment de commencer."
          : `${peopleCount} personne${peopleCount > 1 ? "s" : ""} deja enregistree${peopleCount > 1 ? "s" : ""}.`}
      </p>
    </div>
  );
}
