import { prisma } from "@/lib/prisma";

export function listPeople(search?: string) {
  return prisma.person.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { clanName: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: {
      photos: { where: { isProfile: true }, take: 1 },
    },
  });
}

export function getPersonDetail(personId: string) {
  return prisma.person.findUnique({
    where: { id: personId },
    include: {
      photos: { orderBy: [{ isProfile: "desc" }, { createdAt: "desc" }] },
      memories: { orderBy: { createdAt: "desc" } },
      // Le niveau supplementaire (parentOf / childOf) permet de deduire la
      // fratrie et de grouper les enfants par co-parent sans requete a part.
      childOf: {
        include: {
          parent: { include: { parentOf: { include: { child: true } } } },
        },
      },
      parentOf: {
        include: {
          child: { include: { childOf: { include: { parent: true } } } },
        },
      },
      unionsAsA: { include: { personB: true } },
      unionsAsB: { include: { personA: true } },
    },
  });
}

export function listPeopleForPicker(excludeId?: string) {
  return prisma.person.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: { id: true, firstName: true, lastName: true },
  });
}

export type PersonDetail = NonNullable<Awaited<ReturnType<typeof getPersonDetail>>>;
