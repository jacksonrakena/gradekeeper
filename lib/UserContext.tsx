import { Prisma } from "@prisma/client";
import { createContext, useContext } from "react";
import { getUserQuery } from "../pages/api/user";
import { FullSubject } from "./fullEntities";

export const UserContext = createContext<{
  user?: Prisma.UserGetPayload<typeof getUserQuery>;
  setUser: (user: Prisma.UserGetPayload<typeof getUserQuery>) => void;
  updateCourse: (courseId: string, replacementCourse: FullSubject) => void;
  deleteCourse: (courseId: string) => void;
  redownload: () => Promise<void>;
}>({
  user: undefined,
  setUser: (user: Prisma.UserGetPayload<typeof getUserQuery>) => {},
  updateCourse(courseId, replacementCourse) {},
  deleteCourse(courseId) {},
  async redownload() {},
});
export function useUserContext() {
  return useContext(UserContext);
}
