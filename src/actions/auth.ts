'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  username: z.string().min(3, "Nom d'utilisateur trop court"),
  password: z.string().min(6, 'Mot de passe trop court (6 caractères minimum)')
});

export async function creerCompte(formData: FormData) {
  const data = schema.parse(Object.fromEntries(formData));

  const existant = await prisma.user.findUnique({ where: { username: data.username } });
  if (existant) {
    return { success: false, message: 'Ce nom d’utilisateur existe déjà' };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({ data: { username: data.username, passwordHash } });

  return { success: true };
}
