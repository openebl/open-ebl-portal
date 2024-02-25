import { type Session } from "next-auth";

// Check if the sesssion is valid. return unauthorized error fail if it is invalid
export const validateSession = (session: Session | null) => {
  if (!session) throw new Error("Invalid Session");

  return session;
};
