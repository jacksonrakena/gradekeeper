import { Prisma, Subject } from "@prisma/client";
import useSWR from "swr";
import { getUserQuery } from "../pages/api/user";
import { FullSubject } from "./fullEntities";
import { calculateActualCourseProgressGrade, calculateProjectedCourseGrade, fetcher } from "./logic";

export function useFullUser(): { user?: Prisma.UserGetPayload<typeof getUserQuery>; isLoading: boolean; error: string } {
  const { data: user, error } = useSWR<Prisma.UserGetPayload<typeof getUserQuery>>("/api/user", fetcher, {
    revalidateOnFocus: false,
  });
  return {
    user: user,
    error: error,
    isLoading: !error && !user,
  };
}

export function useFullCourse(
  blockId: string,
  courseId: string
): {
  subject?: FullSubject & { studyBlock: { name: string } };
  otherSubjects?: Subject[];
  gradeMap?: any;
  projectedGrade?: ReturnType<typeof calculateActualCourseProgressGrade>;
  actualGrade?: ReturnType<typeof calculateActualCourseProgressGrade>;
  error: string;
  isLoading: boolean;
} {
  const { data, error } = useSWR("/api/block/" + blockId + "/course/" + courseId, fetcher, {
    revalidateOnFocus: false,
  });
  return {
    subject: data,
    otherSubjects: data?.otherSubjects,
    gradeMap: data?.studyBlock?.user?.gradeMap,
    actualGrade: data && calculateActualCourseProgressGrade(data, data.studyBlock.user.gradeMap),
    projectedGrade: data && calculateProjectedCourseGrade(data, data.studyBlock.user.gradeMap),
    error: error,
    isLoading: !data && !error,
  };
}
