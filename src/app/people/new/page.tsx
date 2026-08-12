import { redirect } from "next/navigation";
import { createPerson } from "@/app/actions/person-actions";
import { isEditor } from "@/lib/auth";
import { PersonForm } from "@/components/PersonForm";

export default async function NewPersonPage() {
  if (!(await isEditor())) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Ajouter une personne</h1>
      <p className="mt-2 text-sm text-muted">
        Tu pourras ajouter ses liens de parente, ses photos et des souvenirs
        une fois la fiche creee.
      </p>
      <div className="mt-8">
        <PersonForm action={createPerson} submitLabel="Creer la fiche" />
      </div>
    </div>
  );
}
