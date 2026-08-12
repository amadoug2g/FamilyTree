import Link from "next/link";
import { notFound } from "next/navigation";
import { getPersonDetail, listPeopleForPicker } from "@/lib/queries";
import { isEditor } from "@/lib/auth";
import { displayName, GENDER_LABEL } from "@/lib/display";
import { computeSiblings, computeChildrenGroups } from "@/lib/relations";
import { Avatar } from "@/components/Avatar";
import { RelationshipsPanel } from "@/components/RelationshipsPanel";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [person, pickerPeople, canEdit] = await Promise.all([
    getPersonDetail(id),
    listPeopleForPicker(id),
    isEditor(),
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
  const siblings = computeSiblings(person.childOf, person.id);
  const childrenGroups = computeChildrenGroups(person.parentOf, person.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar name={displayName(person)} photoUrl={profilePhoto?.url} size={80} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{displayName(person)}</h1>
            <p className="text-sm text-muted">
              {[GENDER_LABEL[person.gender], person.clanName].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-1 text-sm text-muted">
              {person.birthDateText || person.birthPlace
                ? `Né(e) ${[person.birthDateText, person.birthPlace].filter(Boolean).join(", ")}`
                : null}
              {person.isDeceased && (person.deathDateText || person.deathPlace)
                ? ` — Décédé(e) ${[person.deathDateText, person.deathPlace].filter(Boolean).join(", ")}`
                : person.isDeceased
                ? " — Décédé(e)"
                : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-none gap-2">
          <Link
            href={`/?racine=${person.id}`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
          >
            Voir dans l&apos;arbre
          </Link>
          {canEdit && (
            <Link
              href={`/people/${person.id}/edit`}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
            >
              Modifier
            </Link>
          )}
        </div>
      </div>

      <div className="mt-10">
        <RelationshipsPanel
          personId={person.id}
          parents={person.childOf}
          siblings={siblings}
          childrenGroups={childrenGroups}
          unions={unions}
          pickerPeople={pickerPeople}
          canEdit={canEdit}
        />
      </div>
    </div>
  );
}
