import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { put, del } from "@vercel/blob";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 Mo
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function sanitizeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return base.length > 0 ? base : "photo";
}

function assertValidImage(file: File): void {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Format de fichier non accepté. Utilise une image JPEG, PNG, WEBP ou GIF.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Fichier trop volumineux (8 Mo maximum).");
  }
}

/**
 * Enregistre une photo uploadee et retourne l'URL publique a stocker en base.
 * Utilise Vercel Blob si BLOB_READ_WRITE_TOKEN est configure, sinon le disque
 * local sous public/uploads/<personId>/ (pratique pour le developpement).
 */
export async function savePersonPhoto(personId: string, file: File): Promise<string> {
  assertValidImage(file);

  const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;

  if (hasBlobToken()) {
    const blob = await put(`uploads/${personId}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(UPLOAD_ROOT, personId);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${personId}/${filename}`;
}

/** Supprime le fichier correspondant a une photo (Blob distant ou disque local). */
export async function deletePersonPhotoFile(url: string): Promise<void> {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    await del(url).catch(() => {
      // Le fichier a peut-etre deja ete supprime : pas bloquant.
    });
    return;
  }

  const filePath = path.join(process.cwd(), "public", url);
  await unlink(filePath).catch(() => {
    // Le fichier a peut-etre deja ete supprime : pas bloquant.
  });
}
