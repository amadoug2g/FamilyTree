import { addMemory, deleteMemory } from "@/app/actions/person-actions";
import type { Memory } from "@prisma/client";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function MemoriesPanel({
  personId,
  memories,
  canEdit,
}: {
  personId: string;
  memories: Memory[];
  canEdit: boolean;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Souvenirs de la famille</h2>
      <p className="mt-1 text-sm text-muted">
        Une anecdote, un souvenir, une histoire a propos de cette personne.
      </p>

      {memories.length === 0 && !canEdit && <p className="mt-4 text-sm text-muted">Aucun souvenir pour l&apos;instant.</p>}

      {memories.length > 0 && (
        <ul className="mt-4 space-y-3">
          {memories.map((memory) => (
            <li key={memory.id} className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm">{memory.content}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>
                  {memory.authorName} &middot; {formatDate(memory.createdAt)}
                </span>
                {canEdit && (
                  <form action={deleteMemory.bind(null, memory.id, personId)}>
                    <button type="submit" className="hover:text-red-600">
                      Supprimer
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {canEdit && (
        <form action={addMemory.bind(null, personId)} className="mt-4 space-y-3 rounded-lg border border-dashed border-border p-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Ton prenom</span>
            <input name="authorName" required className="max-w-xs" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Souvenir</span>
            <textarea name="content" rows={3} required placeholder="Raconte un souvenir..." />
          </label>
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Partager ce souvenir
          </button>
        </form>
      )}
    </section>
  );
}
