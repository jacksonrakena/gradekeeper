import Decimal from "decimal.js";
import { ParsedCourse, ParsedCourseComponent, ParsedCourseSubcomponent, ParsedStudyBlock, parseStudyBlock } from "../parsing";
import { StudyBlock, User } from "../types";
import {
  calculateActualCourseProgressGrade as calculateActualCourseGrade,
  calculateActualGradeForComponent as calculateActualComponentGrade,
} from "./actual";
import { calculateGpaBasedOnTable, NzGpaTable, UsGpaTable } from "./gpa";
import {
  calculateMaximumPossibleComponentGrade as calculateMaximumComponentGrade,
  calculateMaximumPossibleCourseGrade as calculateMaximumCourseGrade,
} from "./maximum";
import { calculateProjectedCourseGrade, calculateProjectedGradeForComponent as calculateProjectedComponentGrade } from "./projections";

export type GradeMap = { [x: string]: string };

export type ProcessedUser = Omit<User, "studyBlocks"> & {
  studyBlocks: ProcessedStudyBlock[];
};
export type ProcessedStudyBlock = Omit<StudyBlock, "subjects"> & {
  courses: ProcessedCourse[];
  gpaEstimate: CourseGrade;
  usGpaEstimate: CourseGrade;
};
export type ProcessedCourse = Omit<ParsedCourse, "components"> & {
  grades: CourseTriplet;
  status: {
    isCompleted: boolean;
    componentsRemaining: ProcessedCourseComponent[];
    gradeMap: GradeMap;
  };

  components: ProcessedCourseComponent[];
};

export type ProcessedCourseComponent = ParsedCourseComponent & {
  grades: ComponentTriplet;
};

export type ComponentTriplet = GradeTriplet<ComponentGrade>;
export type CourseTriplet = GradeTriplet<CourseGrade>;
export interface GradeTriplet<T> {
  maximum: T;
  actual: T;
  projected: T;
}

export type CourseGrade = { value: Decimal; letter: string; isUnknown: boolean };

export interface ComponentGrade extends CourseGrade {
  isAverage: boolean;
}
export const UnknownCourseGrade: CourseGrade = { value: new Decimal(0), letter: "U", isUnknown: true };
export const UnknownGrade: ComponentGrade = { ...UnknownCourseGrade, isAverage: false };

export function processUser(data: User): ProcessedUser {
  return {
    ...data,
    studyBlocks: data.studyBlocks.map((b) => processStudyBlock(parseStudyBlock(b), data.gradeMap)),
  };
}

export function processStudyBlock(rawStudyBlock: ParsedStudyBlock, gradeMap: GradeMap): ProcessedStudyBlock {
  const processedCourses = rawStudyBlock.subjects.map((rawSubject) => processCourse(rawSubject, gradeMap));

  const r: ProcessedStudyBlock = {
    id: rawStudyBlock.id,
    name: rawStudyBlock.name,
    startDate: rawStudyBlock.startDate,
    endDate: rawStudyBlock.endDate,
    courses: processedCourses,
    gpaEstimate: calculateGpaBasedOnTable(processedCourses, NzGpaTable),
    usGpaEstimate: calculateGpaBasedOnTable(processedCourses, UsGpaTable),
  };
  return r;
}

export function processCourse(course: ParsedCourse, gradeMap: GradeMap): ProcessedCourse {
  let components = course.components.map((e) => processComponent(e, gradeMap));
  const response: ProcessedCourse = {
    ...course,
    grades: {
      maximum: calculateMaximumCourseGrade(course, gradeMap),
      actual: calculateActualCourseGrade(course, gradeMap),
      projected: calculateProjectedCourseGrade(course, gradeMap),
    },
    status: {
      isCompleted: isCourseCompleted(course, gradeMap),
      componentsRemaining: components.filter((d) => {
        const grade = calculateActualComponentGrade(d, gradeMap);
        return grade.isAverage || grade.isUnknown;
      }),
      gradeMap: gradeMap,
    },
    components: course.components.map((e) => processComponent(e, gradeMap)),
  };
  return response;
}

export function processComponent(component: ParsedCourseComponent, gradeMap: GradeMap): ProcessedCourseComponent {
  return {
    ...component,
    grades: {
      actual: calculateActualComponentGrade(component, gradeMap),
      maximum: calculateMaximumComponentGrade(component, gradeMap),
      projected: calculateProjectedComponentGrade(component, gradeMap),
    },
  };
}

export function isCourseCompleted(course: ParsedCourse, gradeMap: GradeMap) {
  return (
    course.components.map((c) => calculateActualComponentGrade(c, gradeMap)).filter((d) => !d.isUnknown && !d.isAverage).length ===
    course.components.length
  );
}

export const singularMap = {
  Assignments: "Assignment",
  Labs: "Lab",
  Lectures: "Lecture",
  Projects: "Project",
  Quizzes: "Quiz",
  Tests: "Test",
  Exams: "Exam",
};

export function randomColor(): string {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function isActiveSubcomponent(
  component: ProcessedCourseComponent,
  subcomponent: ParsedCourseSubcomponent,
  overrideSubcomponents?: ParsedCourseSubcomponent[]
): boolean {
  const subcomponents: ParsedCourseSubcomponent[] = overrideSubcomponents ?? component.subcomponents ?? [];
  var sorted = subcomponents
    .filter((d) => d.isCompleted)
    .sort((first, second) => {
      if (first.gradeValuePercentage < second.gradeValuePercentage) return 1;
      if (first.gradeValuePercentage === second.gradeValuePercentage) return 0;
      return -1;
    });

  for (var i = 0; i < component.numberOfSubComponentsToDrop_Lowest; i++) {
    sorted.pop();
  }
  return sorted.includes(subcomponent);
}

export function getActiveSubcomponents(component: ParsedCourseComponent): ParsedCourseSubcomponent[] {
  var sorted = component.subcomponents
    .filter((d) => d.isCompleted)
    .sort((first, second) => {
      if (first.gradeValuePercentage < second.gradeValuePercentage) return 1;
      if (first.gradeValuePercentage === second.gradeValuePercentage) return 0;
      return -1;
    })
    .map((e) => e);

  for (var i = 0; i < component.numberOfSubComponentsToDrop_Lowest; i++) {
    sorted.pop();
  }
  return sorted;
}

export function calculateLetterGrade(val: Decimal, gradeMap: GradeMap): string {
  let grades = Object.entries(gradeMap).filter((e) => val.greaterThanOrEqualTo(new Decimal(e[0])));
  grades.sort((a, b) => new Decimal(b[0]).cmp(new Decimal(a[0])));
  var result = grades[0];
  if (!result) return "F";
  return result[1];
}

export function getUncompletedAndCompletedActiveSubcomponents(component: ParsedCourseComponent): ParsedCourseSubcomponent[] {
  var sorted = component.subcomponents
    .map((e) => e)
    .sort((first, second) => {
      if (first.gradeValuePercentage.lt(second.gradeValuePercentage)) return -1;
      if (first.gradeValuePercentage.eq(second.gradeValuePercentage)) return 0;
      return 1;
    });

  for (var i = 0; i < component.numberOfSubComponentsToDrop_Lowest; i++) {
    sorted.pop();
  }
  return sorted;
}

export function adjust(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) => ("0" + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2))
  );
}
