import { addPhoto, deletePhoto } from "@/app/actions/person-actions";
import type { Photo } from "@prisma/client";

export function PhotoGallery({ personId, photos }: { personId: string; photos: Photo[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Photos</h2>

      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <figure key={photo.id} className="group relative overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption ?? ""} className="aspect-square w-full object-cover" />
              {photo.caption && (
                <figcaption className="bg-surface p-2 text-xs text-muted">{photo.caption}</figcaption>
              )}
              <form action={deletePhoto.bind(null, photo.id, personId)}>
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Supprimer
                </button>
              </form>
            </figure>
          ))}
        </div>
      )}

      <form
        action={addPhoto.bind(null, personId)}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-border p-4"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Ajouter une photo</span>
          <input type="file" name="file" accept="image/*" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Legende</span>
          <input name="caption" placeholder="ex: Mariage, 1978" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isProfile" className="h-auto w-auto" />
          Photo de profil
        </label>
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Envoyer
        </button>
      </form>
    </section>
  );
}
