import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { hash } from 'argon2';
import { Role } from 'generated/prisma';

export async function createRootUser(app: INestApplication) {
  const prisma = app.get(PrismaService);
  const rootEmail = process.env.ROOT_EMAIL;
  const rootPassword = process.env.ROOT_PASSWORD;
  if (!rootEmail || !rootPassword) {
    console.error(
      'Error: ROOT_EMAIL or ROOT_PASSWORD is not set in environment variables.',
    );
    return;
  }
  const existingAdmin = await prisma.user.findUnique({
    where: { email: rootEmail },
  });

  if (existingAdmin) {
    console.error(
      `ERROR: user with email ${rootEmail} already exists. Skipping...`,
    );
    return;
  }
  const passwordHash = await hash(rootPassword);
  try {
    const rootAdmin = await prisma.user.create({
      data: {
        email: rootEmail,
        name: 'Root Admin',
        password: passwordHash,
        role: Role.ROOT,
      },
    });
    console.log(
      `SUCCESS: created root admin with id ${rootAdmin.id} and email ${rootAdmin.email}`,
    );
  } catch (error) {
    console.error('Error creating root admin:', error);
  }
}
