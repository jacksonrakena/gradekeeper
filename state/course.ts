import { Prisma } from "@prisma/client";
import { atom, selector, useRecoilState } from "recoil";
import { FullSubject } from "../lib/logic/fullEntities";
import { ProcessedCourseInfo, ProcessedStudyBlock, ProcessedUserInfo, processStudyBlock } from "../lib/logic/processing";

import { getUserQuery } from "../pages/api/user";

export type GetUserResponse = Prisma.UserGetPayload<typeof getUserQuery>;
export type DownloadedStudyBlock = GetUserResponse["studyBlocks"][number];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function download(): Promise<GetUserResponse> {
  try {
    const d = await fetch("/api/user");
    const e = await d.json();
    const prismaResponse: Prisma.UserGetPayload<typeof getUserQuery> = e;
    return prismaResponse;
  } catch (e) {
    await wait(1000);
    console.error("Failed to download user data: ", e);
    return await download();
  }
}

export const useInvalidator = () => {
  const [user, setUser] = useRecoilState(UserState);
  return {
    invalidate: async () => {
      const data = await download();
      console.log("[invalidator] " + (!!user ? "New" : "Initial") + " user download: ", data);
      setUser(data);
    },
    updateStudyBlock: (studyBlockId: string, replacementStudyBlock: DownloadedStudyBlock | null) => {
      if (!user) return;
      setUser({
        ...user,
        gradeMap: user?.gradeMap ?? {},
        studyBlocks:
          replacementStudyBlock === null
            ? user?.studyBlocks.filter((e) => e.id !== studyBlockId)
            : user?.studyBlocks.map((sb) => {
                if (sb.id === studyBlockId) return replacementStudyBlock;
                return sb;
              }),
      });
    },
    updateCourse: (courseId: string, replacementCourse: FullSubject | null) => {
      if (!user) return;
      setUser({
        ...user,
        gradeMap: user?.gradeMap ?? {},
        studyBlocks: user?.studyBlocks.map((sb) => {
          if (sb.subjects.filter((d) => d.id === courseId).length === 0) return sb;
          if (!replacementCourse) return { ...sb, subjects: sb.subjects.filter((d) => d.id !== courseId) };
          return {
            ...sb,
            subjects: sb.subjects.map((subj) => {
              if (subj.id === replacementCourse.id) return replacementCourse;
              return subj;
            }),
          };
        }),
      });
    },
  };
};

export const SelectedCourseIdState = atom<string | null>({
  key: "SelectedCourseIdState",
  default: null,
});

export const SelectedCourseState = selector<ProcessedCourseInfo | null>({
  key: "SelectedCourseState",
  get: ({ get }) => {
    const studyBlock = get(SelectedStudyBlockState);
    const id = get(SelectedCourseIdState);
    if (!studyBlock || !id) return null;
    const course = studyBlock?.processedCourses.filter((e) => e.id === id)[0];
    return course ?? null;
  },
});

export const SelectedStudyBlockIdState = atom<string | null>({
  key: "SelectedStudyBlockIdState",
  default: null,
});

export const SelectedStudyBlockState = selector<ProcessedStudyBlock | null>({
  key: "SelectedStudyBlockState",
  get: ({ get }) => {
    const userState = get(ProcessedUserState);
    const id = get(SelectedStudyBlockIdState);
    if (!userState || !id) return null;
    const sb = userState.processedStudyBlocks.filter((e) => e.id === id)[0];
    return sb ?? null;
  },
});

export const UserState = atom<GetUserResponse | null>({
  key: "UserState",
  default: null,
});

export const ProcessedUserState = selector<ProcessedUserInfo | null>({
  key: "ProcessedUserState",
  get: ({ get }) => {
    const userState = get(UserState);
    if (!userState) return null;
    const d = {
      ...userState,
      processedStudyBlocks: userState.studyBlocks.map((rawStudyBlock) => processStudyBlock(rawStudyBlock, userState.gradeMap)),
    };
    console.log("Processed data: ", d);
    return d;
  },
});
