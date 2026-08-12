import type { ReactNode } from "react";
import Link from "next/link";
import { addParentage, addUnion, removeParentage, removeUnion } from "@/app/actions/person-actions";

type PickerPerson = { id: string; firstName: string; lastName: string | null };

function displayName(p: { firstName: string; lastName: string | null }) {
  return [p.firstName, p.lastName].filter(Boolean).join(" ");
}

const PARENT_TYPE_LABEL: Record<string, string> = {
  FATHER: "Pere",
  MOTHER: "Mere",
  GUARDIAN: "Tuteur/tutrice",
};

const UNION_STATUS_LABEL: Record<string, string> = {
  MARRIED: "Marie(e)",
  DIVORCED: "Divorce(e)",
  WIDOWED: "Veuf/veuve",
  UNKNOWN: "Statut non precise",
};

export function RelationshipsPanel({
  personId,
  parents,
  childrenList,
  unions,
  pickerPeople,
  canEdit,
}: {
  personId: string;
  parents: Array<{ id: string; parentType: string; parent: PickerPerson }>;
  childrenList: Array<{ id: string; parentType: string; child: PickerPerson }>;
  unions: Array<{
    unionId: string;
    spouse: PickerPerson;
    status: string;
    startDateText: string | null;
  }>;
  pickerPeople: PickerPerson[];
  canEdit: boolean;
}) {
  return (
    <section className="space-y-8">
      <RelationGroup
        title="Parents"
        emptyLabel="Aucun parent enregistre."
        items={parents.map((p) => ({
          id: p.id,
          label: `${displayName(p.parent)} (${PARENT_TYPE_LABEL[p.parentType] ?? p.parentType})`,
          linkId: p.parent.id,
        }))}
        onRemove={removeParentage}
        personId={personId}
        canEdit={canEdit}
      >
        {canEdit && (
          <form action={addParentage} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="childId" value={personId} />
            <PersonSelect name="parentId" people={pickerPeople} label="Choisir un parent" />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Role</span>
              <select name="parentType" defaultValue="GUARDIAN">
                <option value="FATHER">Pere</option>
                <option value="MOTHER">Mere</option>
                <option value="GUARDIAN">Tuteur/tutrice</option>
              </select>
            </label>
            <SubmitButton label="Ajouter" />
          </form>
        )}
      </RelationGroup>

      <RelationGroup
        title="Enfants"
        emptyLabel="Aucun enfant enregistre."
        items={childrenList.map((c) => ({
          id: c.id,
          label: `${displayName(c.child)} (${PARENT_TYPE_LABEL[c.parentType] ?? c.parentType})`,
          linkId: c.child.id,
        }))}
        onRemove={removeParentage}
        personId={personId}
        canEdit={canEdit}
      >
        {canEdit && (
          <form action={addParentage} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="parentId" value={personId} />
            <PersonSelect name="childId" people={pickerPeople} label="Choisir un enfant" />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Role de cette personne</span>
              <select name="parentType" defaultValue="GUARDIAN">
                <option value="FATHER">Pere</option>
                <option value="MOTHER">Mere</option>
                <option value="GUARDIAN">Tuteur/tutrice</option>
              </select>
            </label>
            <SubmitButton label="Ajouter" />
          </form>
        )}
      </RelationGroup>

      <div>
        <h2 className="text-lg font-semibold">Conjoint(e)s</h2>
        {unions.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucune union enregistree.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {unions.map((u) => (
              <li
                key={u.unionId}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2"
              >
                <div className="text-sm">
                  <Link href={`/people/${u.spouse.id}`} className="font-medium hover:text-accent">
                    {displayName(u.spouse)}
                  </Link>
                  <span className="ml-2 text-muted">
                    {UNION_STATUS_LABEL[u.status] ?? u.status}
                    {u.startDateText ? ` - ${u.startDateText}` : ""}
                  </span>
                </div>
                {canEdit && (
                  <form action={removeUnion.bind(null, u.unionId, personId)}>
                    <button type="submit" className="text-xs text-muted hover:text-red-600">
                      Retirer
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}

        {canEdit && (
          <form action={addUnion.bind(null, personId)} className="mt-4 flex flex-wrap items-end gap-3">
            <PersonSelect name="spouseId" people={pickerPeople} label="Conjoint(e)" />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Statut</span>
              <select name="status" defaultValue="MARRIED">
                <option value="MARRIED">Marie(e)</option>
                <option value="DIVORCED">Divorce(e)</option>
                <option value="WIDOWED">Veuf/veuve</option>
                <option value="UNKNOWN">Non precise</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Date (approx.)</span>
              <input name="startDateText" placeholder="ex: vers 1985" className="w-36" />
            </label>
            <SubmitButton label="Ajouter" />
          </form>
        )}
      </div>
    </section>
  );
}

function RelationGroup({
  title,
  emptyLabel,
  items,
  onRemove,
  personId,
  canEdit,
  children,
}: {
  title: string;
  emptyLabel: string;
  items: Array<{ id: string; label: string; linkId: string }>;
  onRemove: (parentageId: string, personId: string) => void | Promise<void>;
  personId: string;
  canEdit: boolean;
  children?: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2 text-sm"
            >
              <Link href={`/people/${item.linkId}`} className="font-medium hover:text-accent">
                {item.label}
              </Link>
              {canEdit && (
                <form action={onRemove.bind(null, item.id, personId)}>
                  <button type="submit" className="text-xs text-muted hover:text-red-600">
                    Retirer
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function PersonSelect({ name, people, label }: { name: string; people: PickerPerson[]; label: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <select name={name} defaultValue="" required className="min-w-48">
        <option value="" disabled>
          Choisir...
        </option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {displayName(p)}
          </option>
        ))}
      </select>
    </label>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
    >
      {label}
    </button>
  );
}
