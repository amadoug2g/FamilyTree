import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersonDetail, listPeopleForPicker } from "@/lib/queries";
import { PhotoGallery } from "@/components/PhotoGallery";
import { RelationshipsPanel } from "@/components/RelationshipsPanel";
import { MemoriesPanel } from "@/components/MemoriesPanel";

const GENDER_LABEL: Record<string, string> = {
  MALE: "Homme",
  FEMALE: "Femme",
  UNKNOWN: "",
};

function displayName(p: { firstName: string; lastName: string | null }) {
  return [p.firstName, p.lastName].filter(Boolean).join(" ");
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [person, pickerPeople] = await Promise.all([
    getPersonDetail(id),
    listPeopleForPicker(id),
  ]);

  if (!person) notFound();

  const profilePhoto = person.photos.find((p) => p.isProfile) ?? person.photos[0];
  const unions = [
    ...person.unionsAsA.map((u) => ({
      unionId: u.id,
      spouse: u.personB,
      status: u.status,
      startDateText: u.startDateText,
    })),
    ...person.unionsAsB.map((u) => ({
      unionId: u.id,
      spouse: u.personA,
      status: u.status,
      startDateText: u.startDateText,
    })),
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-full bg-surface text-2xl font-medium text-muted">
            {profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profilePhoto.url} alt={displayName(person)} className="h-full w-full object-cover" />
            ) : (
              person.firstName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{displayName(person)}</h1>
            <p className="text-sm text-muted">
              {[GENDER_LABEL[person.gender], person.clanName].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-1 text-sm text-muted">
              {person.birthDateText || person.birthPlace
                ? `Ne(e) ${[person.birthDateText, person.birthPlace].filter(Boolean).join(", ")}`
                : null}
              {person.isDeceased && (person.deathDateText || person.deathPlace)
                ? ` — Decede(e) ${[person.deathDateText, person.deathPlace].filter(Boolean).join(", ")}`
                : person.isDeceased
                ? " — Decede(e)"
                : ""}
            </p>
          </div>
        </div>
        <Link
          href={`/people/${person.id}/edit`}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
        >
          Modifier
        </Link>
      </div>

      {person.bio && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Biographie</h2>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground">{person.bio}</p>
        </section>
      )}

      <div className="mt-10">
        <PhotoGallery personId={person.id} photos={person.photos} />
      </div>

      <div className="mt-10">
        <RelationshipsPanel
          personId={person.id}
          parents={person.childOf}
          childrenList={person.parentOf}
          unions={unions}
          pickerPeople={pickerPeople}
        />
      </div>

      <div className="mt-10">
        <MemoriesPanel personId={person.id} memories={person.memories} />
      </div>
    </div>
  );
}
