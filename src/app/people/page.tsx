import Link from "next/link";
import { listPeople } from "@/lib/queries";

function displayName(p: { firstName: string; lastName: string | null }) {
  return [p.firstName, p.lastName].filter(Boolean).join(" ");
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const people = await listPeople(q);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Les membres de la famille</h1>
        <Link
          href="/people/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          + Ajouter une personne
        </Link>
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
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {people.map((person) => (
            <li key={person.id}>
              <Link
                href={`/people/${person.id}`}
                className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 hover:border-accent"
              >
                <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-full bg-background text-lg font-medium text-muted">
                  {person.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.photos[0].url}
                      alt={displayName(person)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    person.firstName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-medium">{displayName(person)}</p>
                  {person.clanName && <p className="text-sm text-muted">{person.clanName}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
