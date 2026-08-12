import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePerson, deletePerson } from "@/app/actions/person-actions";
import { isEditor } from "@/lib/auth";
import { PersonForm } from "@/components/PersonForm";
import { PhotoGallery } from "@/components/PhotoGallery";

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isEditor())) redirect("/login");

  const { id } = await params;
  const person = await prisma.person.findUnique({
    where: { id },
    include: { photos: { orderBy: [{ isProfile: "desc" }, { createdAt: "desc" }] } },
  });
  if (!person) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Modifier la fiche de {person.firstName}
      </h1>
      <div className="mt-8">
        <PersonForm
          action={updatePerson.bind(null, id)}
          defaultValues={person}
          submitLabel="Enregistrer les modifications"
        />
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <PhotoGallery personId={person.id} photos={person.photos} canEdit />
      </div>

      <form action={deletePerson.bind(null, id)} className="mt-10 border-t border-border pt-6">
        <p className="text-sm text-muted">
          Supprimer definitivement cette personne et toutes les donnees
          associees (photos, souvenirs, liens de parente).
        </p>
        <button
          type="submit"
          className="mt-3 rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
        >
          Supprimer la fiche
        </button>
      </form>
    </div>
  );
}
