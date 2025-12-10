"use server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return;

  // Try to find user in DB
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  // If user exists, we are good
  if (existingUser) return existingUser;

  // If NOT, create them right now
  return await prisma.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    },
  });
}
