import Link from "next/link";
import { listPeople } from "@/lib/queries";
import { isEditor } from "@/lib/auth";
import { displayName } from "@/lib/display";
import { Avatar } from "@/components/Avatar";

function groupKey(p: { firstName: string; lastName: string | null }): string {
  return (p.lastName || p.firstName).charAt(0).toUpperCase();
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [people, canEdit] = await Promise.all([listPeople(q), isEditor()]);

  const groups = new Map<string, typeof people>();
  for (const person of people) {
    const key = groupKey(person);
    const list = groups.get(key) ?? [];
    list.push(person);
    groups.set(key, list);
  }
  const letters = [...groups.keys()].sort((a, b) => a.localeCompare(b, "fr"));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Index alphabétique</h1>
          <p className="mt-1 text-sm text-muted">
            <Link href="/" className="text-accent hover:underline">
              Voir l&apos;arbre
            </Link>{" "}
            pour les liens de parenté.
          </p>
        </div>
        {canEdit && (
          <Link
            href="/people/new"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            + Ajouter une personne
          </Link>
        )}
      </div>

      <form className="mt-6" action="/people">
        <input
          type="search"
          name="q"
          placeholder="Rechercher un nom, un prenom, un clan..."
          defaultValue={q ?? ""}
          className="w-full sm:w-96"
        />
      </form>

      {people.length === 0 ? (
        <p className="mt-10 text-muted">
          {q ? "Aucune personne ne correspond a cette recherche." : "Aucune personne enregistree pour l'instant."}
        </p>
      ) : (
        <>
          <nav className="mt-6 flex flex-wrap gap-2 text-sm">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#lettre-${letter}`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:border-accent hover:text-accent"
              >
                {letter}
              </a>
            ))}
          </nav>

          <div className="mt-8 space-y-8">
            {letters.map((letter) => (
              <section key={letter} id={`lettre-${letter}`}>
                <h2 className="text-lg font-semibold text-accent">{letter}</h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {groups.get(letter)!.map((person) => (
                    <li key={person.id}>
                      <Link
                        href={`/people/${person.id}`}
                        className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 hover:border-accent"
                      >
                        <Avatar name={displayName(person)} photoUrl={person.photos[0]?.url} />
                        <div>
                          <p className="font-medium">{displayName(person)}</p>
                          {person.clanName && <p className="text-sm text-muted">{person.clanName}</p>}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
