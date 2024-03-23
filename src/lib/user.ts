import { type User } from "@prisma/client";

export const userHasRole = (user:User, role:string) => {
    return user.userRoles.some((userRole) => userRole.role === role);
}
