import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

function sanitizeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.length > 0 ? base : "photo";
}

/**
 * Enregistre une photo uploadee sur le disque, sous public/uploads/<personId>/.
 * Retourne l'URL publique relative a stocker en base.
 */
export async function savePersonPhoto(personId: string, file: File): Promise<string> {
  const dir = path.join(UPLOAD_ROOT, personId);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/${personId}/${filename}`;
}
