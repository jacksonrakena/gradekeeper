import { createContext, useContext } from "react";
import { FullSubject } from "./fullEntities";
import { ProcessedUserInfo } from "./logic";

export type AppContext = {
  user?: ProcessedUserInfo;
  setUser: (user: ProcessedUserInfo) => void;
  updateCourse: (courseId: string, replacementCourse?: FullSubject) => void;
  redownload: () => Promise<void>;
};
export const UserContext = createContext<AppContext>({
  user: undefined,
  setUser: (user: ProcessedUserInfo) => {},
  updateCourse(courseId, replacementCourse) {},
  async redownload() {},
});
export function useUserContext() {
  return useContext(UserContext);
}
