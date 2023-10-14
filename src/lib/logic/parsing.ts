import Decimal from "decimal.js";
import { Course, CourseComponent, CourseSubcomponent, StudyBlock } from "./types";

export type ParsedStudyBlock = Omit<StudyBlock, "courses"> & {
  courses: ParsedCourse[];
};
export type ParsedCourse = Omit<Course, "components"> & {
  components: ParsedCourseComponent[];
};

export type ParsedCourseComponent = Omit<Omit<CourseComponent, "subcomponents">, "subjectWeighting"> & {
  subjectWeighting: Decimal;
  subcomponents: ParsedCourseSubcomponent[];
};

export type ParsedCourseSubcomponent = Omit<CourseSubcomponent, "gradeValuePercentage"> & {
  gradeValuePercentage: Decimal;
};

export function parseStudyBlock(studyBlock: StudyBlock): ParsedStudyBlock {
  return {
    ...studyBlock,
    courses: studyBlock.courses.map((e) => parseCourseInfo(e)),
  };
}

export function parseCourseInfo(course: Course): ParsedCourse {
  return {
    ...course,
    components: course.components.map((e) => parseComponent(e)),
  };
}

export function parseComponent(component: CourseComponent): ParsedCourseComponent {
  return {
    ...component,
    subjectWeighting: new Decimal(component.subjectWeighting),
    subcomponents: component.subcomponents.map((e) => parseSubcomponent(e)),
  };
}

export function parseSubcomponent(subcomponent: CourseSubcomponent): ParsedCourseSubcomponent {
  return {
    ...subcomponent,
    gradeValuePercentage: new Decimal(subcomponent.gradeValuePercentage),
  };
}
