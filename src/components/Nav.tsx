import Link from "next/link";
import { logout } from "@/app/actions/auth-actions";

export function Nav({ canEdit }: { canEdit: boolean }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-accent">
          FamilyTree
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/people" className="hover:text-accent">
            Les membres
          </Link>
          {canEdit && (
            <Link href="/people/new" className="hover:text-accent">
              Ajouter une personne
            </Link>
          )}
          {canEdit ? (
            <form action={logout}>
              <button type="submit" className="text-muted hover:text-accent">
                Se déconnecter
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-muted hover:text-accent">
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
