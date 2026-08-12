export function parseOptionalDate(value: FormDataEntryValue | null): Date | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function str(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function optionalStr(value: FormDataEntryValue | null): string | undefined {
  const s = str(value);
  return s === "" ? undefined : s;
}
