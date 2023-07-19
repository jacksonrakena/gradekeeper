import { atom, selector, useRecoilState } from "recoil";
import { ProcessedUser } from "../logic/processing";
import { processUser } from "../logic/processing/index";
import { StudyBlock, Subject, SubjectComponent, SubjectSubcomponent, User } from "../logic/types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function download(): Promise<User> {
  try {
    const d = await fetch("/api/users/me");
    const e = await d.json();
    if (e.error) throw 'Received error from server: "' + e.error + '"';
    const prismaResponse: User = e;
    return prismaResponse;
  } catch (e) {
    await wait(1000);
    console.error("Failed to download user data: ", e);
    return await download();
  }
}

export const useInvalidator = () => {
  const [user, setUser] = useRecoilState(UserState);
  const invalidate = async () => {
    const data = await download();
    console.log("[invalidator] " + (!!user ? "New" : "Initial") + " user download: ", data);
    setUser(data);
  };
  const updateStudyBlock = (studyBlockId: string, replacementStudyBlock: StudyBlock | null) => {
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
  };
  const updateCourse = (courseId: string, replacementCourse: ((e: Subject) => Subject) | null) => {
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
            if (subj.id === courseId) return replacementCourse(subj);
            return subj;
          }),
        };
      }),
    });
  };
  const updateComponent = (
    courseId: string,
    componentId: string,
    replacementComponent: ((e: SubjectComponent) => SubjectComponent) | null
  ) => {
    if (!user) return;
    updateCourse(courseId, (c) => ({
      ...c,
      components: replacementComponent
        ? c.components.map((cx) => (cx.id === componentId ? replacementComponent(cx) : cx))
        : c.components.filter((cx) => cx.id !== componentId),
    }));
  };
  const updateSubcomponent = (
    courseId: string,
    componentId: string,
    subcomponentId: string,
    replacementSubcomponent: ((e: SubjectSubcomponent) => SubjectSubcomponent) | null
  ) => {
    if (!user) return;
    updateComponent(courseId, componentId, (component) => ({
      ...component,
      subcomponents: replacementSubcomponent
        ? component.subcomponents.map((c) => (c.id === subcomponentId ? replacementSubcomponent(c) : c))
        : component.subcomponents.filter((c) => c.id !== subcomponentId),
    }));
  };
  return {
    invalidate,
    updateStudyBlock,
    updateComponent,
    updateCourse,
    updateSubcomponent,
  };
};

// export const SelectedCourseIdState = atom<string | null>({
//   key: "SelectedCourseIdState",
//   default: null,
// });

// export const SelectedCourseState = selector<ProcessedCourseInfo | null>({
//   key: "SelectedCourseState",
//   get: ({ get }) => {
//     const studyBlock = get(SelectedStudyBlockState);
//     const id = get(SelectedCourseIdState);
//     if (!studyBlock || !id) return null;
//     const course = studyBlock?.courses.filter((e) => e.id === id)[0];
//     return course ?? null;
//   },
// });

// export const SelectedStudyBlockIdState = atom<string | null>({
//   key: "SelectedStudyBlockIdState",
//   default: null,
// });

// export const SelectedStudyBlockState = selector<ProcessedStudyBlock | null>({
//   key: "SelectedStudyBlockState",
//   get: ({ get }) => {
//     const userState = get(ProcessedUserState);
//     const id = get(SelectedStudyBlockIdState);
//     if (!userState || !id) return null;
//     const sb = userState.studyBlocks.filter((e) => e.id === id)[0];
//     return sb ?? null;
//   },
// });

export const UserState = atom<User | null>({
  key: "UserState",
  default: null,
});

export const ProcessedUserState = selector<ProcessedUser | null>({
  key: "ProcessedUserState",
  get: ({ get }) => {
    const userState = get(UserState);
    if (!userState) return null;
    const processedData = processUser(userState);
    console.log("Processed data: ", processedData);
    return processedData;
  },
});
