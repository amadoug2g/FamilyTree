import type { ReactNode } from "react";
import Link from "next/link";
import { addParentage, addUnion, removeParentage, removeUnion } from "@/app/actions/person-actions";
import { displayName, PARENT_TYPE_LABEL, UNION_STATUS_LABEL } from "@/lib/display";
import type { ChildrenGroup } from "@/lib/relations";

type PickerPerson = { id: string; firstName: string; lastName: string | null };

export function RelationshipsPanel({
  personId,
  parents,
  siblings,
  childrenGroups,
  unions,
  pickerPeople,
  canEdit,
}: {
  personId: string;
  parents: Array<{ id: string; parentType: string; parent: PickerPerson }>;
  siblings: PickerPerson[];
  childrenGroups: ChildrenGroup[];
  unions: Array<{
    unionId: string;
    spouse: PickerPerson;
    status: string;
    startDateText: string | null;
  }>;
  pickerPeople: PickerPerson[];
  canEdit: boolean;
}) {
  const totalChildren = childrenGroups.reduce((sum, g) => sum + g.children.length, 0);

  return (
    <section className="space-y-8">
      {/* Parents */}
      <RelationGroup
        title="Parents"
        emptyLabel="Aucun parent enregistré."
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
              <span className="font-medium">Rôle</span>
              <select name="parentType" defaultValue="GUARDIAN">
                <option value="FATHER">Père</option>
                <option value="MOTHER">Mère</option>
                <option value="GUARDIAN">Tuteur/tutrice</option>
              </select>
            </label>
            <SubmitButton label="Ajouter" />
          </form>
        )}
      </RelationGroup>

      {/* Conjoint(e)s */}
      <div>
        <h2 className="text-lg font-semibold">Conjoint(e)s</h2>
        {unions.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucune union enregistrée.</p>
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
                <option value="MARRIED">Marié(e)</option>
                <option value="DIVORCED">Divorcé(e)</option>
                <option value="WIDOWED">Veuf/veuve</option>
                <option value="UNKNOWN">Non précisé</option>
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

      {/* Frères et sœurs (deduit, pas stocke) */}
      <div>
        <h2 className="text-lg font-semibold">Frères et sœurs</h2>
        {siblings.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucun frère ou sœur connu.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {siblings.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/people/${s.id}`}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
                >
                  {displayName(s)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Enfants, groupes par co-parent si plusieurs sont connus */}
      <div>
        <h2 className="text-lg font-semibold">Enfants</h2>
        {totalChildren === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucun enfant enregistré.</p>
        ) : childrenGroups.length === 1 ? (
          <ChildrenList group={childrenGroups[0]} personId={personId} canEdit={canEdit} />
        ) : (
          <div className="mt-3 space-y-4">
            {childrenGroups.map((group) => (
              <div key={group.coParent?.id ?? "sans-autre-parent"}>
                <p className="text-sm font-medium text-muted">
                  {group.coParent ? (
                    <>
                      Avec{" "}
                      <Link href={`/people/${group.coParent.id}`} className="hover:text-accent">
                        {displayName(group.coParent)}
                      </Link>
                    </>
                  ) : (
                    "Sans autre parent connu"
                  )}
                </p>
                <ChildrenList group={group} personId={personId} canEdit={canEdit} bare />
              </div>
            ))}
          </div>
        )}

        {canEdit && (
          <form action={addParentage} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="parentId" value={personId} />
            <PersonSelect name="childId" people={pickerPeople} label="Choisir un enfant" />
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Rôle de cette personne</span>
              <select name="parentType" defaultValue="GUARDIAN">
                <option value="FATHER">Père</option>
                <option value="MOTHER">Mère</option>
                <option value="GUARDIAN">Tuteur/tutrice</option>
              </select>
            </label>
            <SubmitButton label="Ajouter" />
          </form>
        )}
      </div>
    </section>
  );
}

function ChildrenList({
  group,
  personId,
  canEdit,
  bare = false,
}: {
  group: ChildrenGroup;
  personId: string;
  canEdit: boolean;
  bare?: boolean;
}) {
  return (
    <ul className={bare ? "mt-2 space-y-2" : "mt-3 space-y-2"}>
      {group.children.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2 text-sm"
        >
          <Link href={`/people/${c.child.id}`} className="font-medium hover:text-accent">
            {displayName(c.child)} ({PARENT_TYPE_LABEL[c.parentType] ?? c.parentType})
          </Link>
          {canEdit && (
            <form action={removeParentage.bind(null, c.id, personId)}>
              <button type="submit" className="text-xs text-muted hover:text-red-600">
                Retirer
              </button>
            </form>
          )}
        </li>
      ))}
    </ul>
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
