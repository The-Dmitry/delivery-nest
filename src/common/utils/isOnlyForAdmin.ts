import { Role } from 'generated/prisma';

const admins: Role[] = [Role.ADMIN, Role.ROOT] as const;

const isOnlyForAdmin = (role?: Role) => {
  if (!role) {
    return false;
  }
  return admins.includes(role);
};

export default isOnlyForAdmin;
