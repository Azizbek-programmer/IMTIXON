import { Roles } from 'generated/prisma';

export type JwtPayload = {
  id: number;
  email: string;
  role: Roles;
  is_verified: boolean
};
