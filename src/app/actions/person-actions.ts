"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePersonPhoto, deletePersonPhotoFile } from "@/lib/photos";
import { requireEditor } from "@/lib/auth";
import { optionalStr, parseOptionalDate, str } from "@/lib/validators";
import type { Gender, ParentType } from "@prisma/client";

function isGender(value: string): value is Gender {
  return value === "MALE" || value === "FEMALE" || value === "UNKNOWN";
}

function isParentType(value: string): value is ParentType {
  return value === "FATHER" || value === "MOTHER" || value === "GUARDIAN";
}

export async function createPerson(formData: FormData) {
  await requireEditor();
  const genderRaw = str(formData.get("gender"));
  const isDeceased = formData.get("isDeceased") === "on";

  const person = await prisma.person.create({
    data: {
      firstName: str(formData.get("firstName")),
      lastName: optionalStr(formData.get("lastName")),
      clanName: optionalStr(formData.get("clanName")),
      gender: isGender(genderRaw) ? genderRaw : "UNKNOWN",
      birthDate: parseOptionalDate(formData.get("birthDate")),
      birthDateText: optionalStr(formData.get("birthDateText")),
      birthPlace: optionalStr(formData.get("birthPlace")),
      deathDate: parseOptionalDate(formData.get("deathDate")),
      deathDateText: optionalStr(formData.get("deathDateText")),
      deathPlace: optionalStr(formData.get("deathPlace")),
      isDeceased,
      bio: optionalStr(formData.get("bio")),
      notes: optionalStr(formData.get("notes")),
    },
  });

  revalidatePath("/people");
  redirect(`/people/${person.id}`);
}

export async function updatePerson(personId: string, formData: FormData) {
  await requireEditor();
  const genderRaw = str(formData.get("gender"));
  const isDeceased = formData.get("isDeceased") === "on";

  await prisma.person.update({
    where: { id: personId },
    data: {
      firstName: str(formData.get("firstName")),
      lastName: optionalStr(formData.get("lastName")),
      clanName: optionalStr(formData.get("clanName")),
      gender: isGender(genderRaw) ? genderRaw : "UNKNOWN",
      birthDate: parseOptionalDate(formData.get("birthDate")),
      birthDateText: optionalStr(formData.get("birthDateText")),
      birthPlace: optionalStr(formData.get("birthPlace")),
      deathDate: parseOptionalDate(formData.get("deathDate")),
      deathDateText: optionalStr(formData.get("deathDateText")),
      deathPlace: optionalStr(formData.get("deathPlace")),
      isDeceased,
      bio: optionalStr(formData.get("bio")),
      notes: optionalStr(formData.get("notes")),
    },
  });

  revalidatePath("/people");
  revalidatePath(`/people/${personId}`);
  redirect(`/people/${personId}`);
}

export async function deletePerson(personId: string) {
  await requireEditor();
  const photos = await prisma.photo.findMany({ where: { personId }, select: { url: true } });
  await prisma.person.delete({ where: { id: personId } });
  await Promise.all(photos.map((p) => deletePersonPhotoFile(p.url)));
  revalidatePath("/people");
  redirect("/people");
}

export async function addParentage(formData: FormData) {
  await requireEditor();
  const parentId = str(formData.get("parentId"));
  const childId = str(formData.get("childId"));
  const parentTypeRaw = str(formData.get("parentType"));
  if (!parentId || !childId || parentId === childId) return;

  await prisma.parentage.upsert({
    where: { parentId_childId: { parentId, childId } },
    create: {
      parentId,
      childId,
      parentType: isParentType(parentTypeRaw) ? parentTypeRaw : "GUARDIAN",
    },
    update: {
      parentType: isParentType(parentTypeRaw) ? parentTypeRaw : "GUARDIAN",
    },
  });

  revalidatePath(`/people/${childId}`);
  revalidatePath(`/people/${parentId}`);
}

export async function removeParentage(parentageId: string, personId: string) {
  await requireEditor();
  await prisma.parentage.delete({ where: { id: parentageId } });
  revalidatePath(`/people/${personId}`);
}

export async function addUnion(personId: string, formData: FormData) {
  await requireEditor();
  const otherId = str(formData.get("spouseId"));
  if (!otherId || otherId === personId) return;

  const status = str(formData.get("status"));
  const validStatus = ["MARRIED", "DIVORCED", "WIDOWED", "UNKNOWN"].includes(status)
    ? (status as "MARRIED" | "DIVORCED" | "WIDOWED" | "UNKNOWN")
    : "UNKNOWN";

  await prisma.union.create({
    data: {
      personAId: personId,
      personBId: otherId,
      status: validStatus,
      startDate: parseOptionalDate(formData.get("startDate")),
      startDateText: optionalStr(formData.get("startDateText")),
      place: optionalStr(formData.get("place")),
      notes: optionalStr(formData.get("notes")),
    },
  });

  revalidatePath(`/people/${personId}`);
  revalidatePath(`/people/${otherId}`);
}

export async function removeUnion(unionId: string, personId: string) {
  await requireEditor();
  const union = await prisma.union.findUnique({ where: { id: unionId } });
  await prisma.union.delete({ where: { id: unionId } });
  revalidatePath(`/people/${personId}`);
  if (union) {
    revalidatePath(`/people/${union.personAId}`);
    revalidatePath(`/people/${union.personBId}`);
  }
}

export async function addPhoto(personId: string, formData: FormData) {
  await requireEditor();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return;

  const url = await savePersonPhoto(personId, file);
  const isProfile = formData.get("isProfile") === "on";

  if (isProfile) {
    await prisma.photo.updateMany({
      where: { personId, isProfile: true },
      data: { isProfile: false },
    });
  }

  await prisma.photo.create({
    data: {
      personId,
      url,
      caption: optionalStr(formData.get("caption")),
      takenDateText: optionalStr(formData.get("takenDateText")),
      isProfile,
    },
  });

  revalidatePath(`/people/${personId}`);
}

export async function deletePhoto(photoId: string, personId: string) {
  await requireEditor();
  const photo = await prisma.photo.delete({ where: { id: photoId } });
  await deletePersonPhotoFile(photo.url);
  revalidatePath(`/people/${personId}`);
}

export async function addMemory(personId: string, formData: FormData) {
  await requireEditor();
  const authorName = str(formData.get("authorName"));
  const content = str(formData.get("content"));
  if (!authorName || !content) return;

  await prisma.memory.create({
    data: { personId, authorName, content },
  });

  revalidatePath(`/people/${personId}`);
}

export async function deleteMemory(memoryId: string, personId: string) {
  await requireEditor();
  await prisma.memory.delete({ where: { id: memoryId } });
  revalidatePath(`/people/${personId}`);
}
