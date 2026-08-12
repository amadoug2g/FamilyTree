import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "ft_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 jours

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET n'est pas défini dans les variables d'environnement.");
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function makeSessionToken(): string {
  const payload = "editor";
  return `${payload}.${sign(payload)}`;
}

function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  return timingSafeEqual(signature, sign(payload));
}

/** Lecture de l'état de connexion, sans effet de bord. */
export async function isEditor(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(COOKIE_NAME)?.value);
}

/** À appeler en première ligne de chaque action qui modifie des données. */
export async function requireEditor(): Promise<void> {
  if (!(await isEditor())) {
    throw new Error("Action réservée aux personnes autorisées à modifier l'arbre.");
  }
}

/** Vérifie le mot de passe et ouvre la session si correct. */
export async function signIn(password: string): Promise<boolean> {
  const expected = process.env.SITE_EDIT_PASSWORD;
  if (!expected || !password || !timingSafeEqual(password, expected)) {
    return false;
  }

  const store = await cookies();
  store.set(COOKIE_NAME, makeSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
