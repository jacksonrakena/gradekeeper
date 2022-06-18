import { Prisma } from "@prisma/client";
import { createContext, useContext } from "react";
import { FullSubject } from "./lib/fullEntities";
import { getUserQuery } from "./pages/api/user";

export const UserContext = createContext<{
  user?: Prisma.UserGetPayload<typeof getUserQuery>;
  setUser: (user: Prisma.UserGetPayload<typeof getUserQuery>) => void;
  updateCourse: (courseId: string, replacementCourse: FullSubject) => void;
  deleteCourse: (courseId: string) => void;
}>({
  user: undefined,
  setUser: (user: Prisma.UserGetPayload<typeof getUserQuery>) => {},
  updateCourse(courseId, replacementCourse) {},
  deleteCourse(courseId) {},
});
export function useUserContext() {
  return useContext(UserContext);
}
