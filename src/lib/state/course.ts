import { atom, selector, useRecoilState } from "recoil";
import { ProcessedUser } from "../logic/processing";
import { processUser } from "../logic/processing/index";
import { StudyBlock, Subject, SubjectComponent, SubjectSubcomponent, User } from "../logic/types";
import { routes, useFetcher } from "../net/fetch";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useInvalidator = () => {
  const [user, setUser] = useRecoilState(UserState);
  const fetcher = useFetcher();
  const invalidate = async () => {
    let data = await fetcher.json<User>(routes.getMe());
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
    return processedData;
  },
});
