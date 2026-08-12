// Libelles et formatage partages entre les pages et composants.
// Centralise ici pour eviter les copies divergentes (displayName etait
// dans 3 fichiers, les libelles de role/statut dans 2).

export type NameParts = { firstName: string; lastName: string | null };

export function displayName(person: NameParts): string {
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}

export const GENDER_LABEL: Record<string, string> = {
  MALE: "Homme",
  FEMALE: "Femme",
  UNKNOWN: "",
};

export const PARENT_TYPE_LABEL: Record<string, string> = {
  FATHER: "Père",
  MOTHER: "Mère",
  GUARDIAN: "Tuteur/tutrice",
};

export const UNION_STATUS_LABEL: Record<string, string> = {
  MARRIED: "Marié(e)",
  DIVORCED: "Divorcé(e)",
  WIDOWED: "Veuf/veuve",
  UNKNOWN: "Statut non précisé",
};
