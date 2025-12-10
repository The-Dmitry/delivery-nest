import { Role } from 'generated/prisma';

const admins: Role[] = [Role.ADMIN, Role.ROOT] as const;

const isOnlyForAdmin = (role?: Role, value?: boolean) => {
  if (!role) {
    return false;
  }
  return value && admins.includes(role);
};

export default isOnlyForAdmin;
