import Decimal from "decimal.js";
import { Course, CourseComponent, CourseSubcomponent, StudyBlock } from "./types";

export interface ParsedStudyBlock {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  courses: ParsedCourse[];
}
export interface ParsedCourse {
  id: string;
  longName: string;
  courseCodeName: string;
  courseCodeNumber: string;
  studyBlockId: string;
  color: string;

  components: ParsedCourseComponent[];
}

export interface ParsedCourseComponent {
  id: string;
  name: string;
  courseId: string;
  nameOfSubcomponentSingular: string;
  subjectWeighting: Decimal;
  numberOfSubComponentsToDrop_Lowest: number;
  subcomponents: ParsedCourseSubcomponent[];
}

export interface ParsedCourseSubcomponent {
  id: string;
  numberInSequence: number;
  overrideName?: string;
  isCompleted: boolean;
  gradeValuePercentage: Decimal;
}

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
