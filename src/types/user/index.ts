import { z } from "zod";

const UserInfoFormSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
});

const UserRoleSchema = z.enum(["admin", "operator", "viewonly"]);

const UserFormSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  role: UserRoleSchema,
});

type UserInfoFormType = z.infer<typeof UserInfoFormSchema>;
type UserFormType = z.infer<typeof UserFormSchema>;
type UserRoleType = z.infer<typeof UserRoleSchema>;

const userRoleMapping: Record<UserRoleType, string> = {
  admin: "Administrator",
  operator: "Operator",
  viewonly: "View Only",
};

export {
  userRoleMapping,
  UserInfoFormSchema,
  UserFormSchema,
  UserRoleSchema,
};
export type {
  UserInfoFormType,
  UserFormType,
  UserRoleType,
};
