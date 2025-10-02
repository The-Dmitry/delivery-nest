import { Role } from 'generated/prisma';

const admins: Role[] = [Role.ADMIN, Role.ROOT];

export function isAdmin(role: Role, shouldBeEqualTo?: Role) {
  if (shouldBeEqualTo) {
    return role === shouldBeEqualTo;
  }
  return admins.includes(role);
}
