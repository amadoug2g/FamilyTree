import { login } from "@/app/actions/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Se connecter</h1>
      <p className="mt-2 text-sm text-muted">
        Le mot de passe permet de modifier l&apos;arbre (ajouter des personnes,
        des liens, des photos, des souvenirs). La consultation ne nécessite
        pas de connexion.
      </p>

      <form action={login} className="mt-6 space-y-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Mot de passe</span>
          <input type="password" name="password" required autoFocus />
        </label>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">Mot de passe incorrect.</p>
        )}
        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
