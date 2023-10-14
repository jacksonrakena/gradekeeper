import { atom, selector, useRecoilState } from "recoil";
import { ProcessedUser } from "../logic/processing";
import { processUser } from "../logic/processing/index";
import { Course, CourseComponent, CourseSubcomponent, StudyBlock, User } from "../logic/types";
import { routes, useApi } from "../net/fetch";

export const useInvalidator = () => {
  const [user, setUser] = useRecoilState(UserState);
  const fetcher = useApi();
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
  const updateCourse = (courseId: string, replacementCourse: ((e: Course) => Course) | null) => {
    if (!user) return;
    setUser({
      ...user,
      gradeMap: user?.gradeMap ?? {},
      studyBlocks: user?.studyBlocks.map((sb) => {
        if (sb.courses.filter((d) => d.id === courseId).length === 0) return sb;
        if (!replacementCourse) return { ...sb, courses: sb.courses.filter((d) => d.id !== courseId) };
        return {
          ...sb,
          courses: sb.courses.map((subj) => {
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
    replacementComponent: ((e: CourseComponent) => CourseComponent) | null
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
    replacementSubcomponent: ((e: CourseSubcomponent) => CourseSubcomponent) | null
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
