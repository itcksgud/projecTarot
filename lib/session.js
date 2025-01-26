import { getSession } from "next-auth/react";

export const getServerSession = async (req) => {
  return await getSession({ req });
};