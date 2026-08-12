import type { ReactNode } from "react";
import type { Person } from "@prisma/client";

function toDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function PersonForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Person;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prenom" required>
          <input name="firstName" required defaultValue={defaultValues?.firstName} />
        </Field>
        <Field label="Nom">
          <input name="lastName" defaultValue={defaultValues?.lastName ?? ""} />
        </Field>
        <Field label="Nom de clan / lignage (yettoore)">
          <input name="clanName" defaultValue={defaultValues?.clanName ?? ""} />
        </Field>
        <Field label="Genre">
          <select name="gender" defaultValue={defaultValues?.gender ?? "UNKNOWN"}>
            <option value="UNKNOWN">Non precise</option>
            <option value="MALE">Homme</option>
            <option value="FEMALE">Femme</option>
          </select>
        </Field>
      </div>

      <fieldset className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium text-muted">Naissance</legend>
        <Field label="Date de naissance (si connue)">
          <input type="date" name="birthDate" defaultValue={toDateInputValue(defaultValues?.birthDate)} />
        </Field>
        <Field label="Date approximative (ex: vers 1950)">
          <input name="birthDateText" defaultValue={defaultValues?.birthDateText ?? ""} />
        </Field>
        <Field label="Lieu de naissance" className="sm:col-span-2">
          <input name="birthPlace" defaultValue={defaultValues?.birthPlace ?? ""} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-medium text-muted">Deces</legend>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            name="isDeceased"
            defaultChecked={defaultValues?.isDeceased}
            className="h-auto w-auto"
          />
          Cette personne est decedee
        </label>
        <Field label="Date de deces (si connue)">
          <input type="date" name="deathDate" defaultValue={toDateInputValue(defaultValues?.deathDate)} />
        </Field>
        <Field label="Date approximative">
          <input name="deathDateText" defaultValue={defaultValues?.deathDateText ?? ""} />
        </Field>
        <Field label="Lieu de deces" className="sm:col-span-2">
          <input name="deathPlace" defaultValue={defaultValues?.deathPlace ?? ""} />
        </Field>
      </fieldset>

      <Field label="Biographie">
        <textarea
          name="bio"
          rows={6}
          placeholder="Son histoire, son parcours, ce qui la caracterisait..."
          defaultValue={defaultValues?.bio ?? ""}
        />
      </Field>

      <Field label="Notes internes (non biographiques)">
        <textarea name="notes" rows={3} defaultValue={defaultValues?.notes ?? ""} />
      </Field>

      <button
        type="submit"
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className ?? ""}`}>
      <span className="font-medium">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
    </label>
  );
}
