import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-accent">
          FamilyTree
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/people" className="hover:text-accent">
            Les membres
          </Link>
          <Link href="/people/new" className="hover:text-accent">
            Ajouter une personne
          </Link>
        </nav>
      </div>
    </header>
  );
}
