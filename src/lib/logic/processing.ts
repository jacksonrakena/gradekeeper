import Decimal from "decimal.js";
import { ParsedCourse, ParsedCourseComponent, ParsedCourseSubcomponent, ParsedStudyBlock, parseStudyBlock } from "./parsing";
import { StudyBlock, SubjectComponent, SubjectSubcomponent, User } from "./types";

export function _null<T>(): T | null {
  return null;
}

export function _undefined<T>(): T | undefined {
  return undefined;
}

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
export { fetcher };

export type ProcessedUser = Omit<User, "studyBlocks"> & {
  studyBlocks: ProcessedStudyBlock[];
};
export function beginProcessing(data: User): ProcessedUser {
  const map = data.gradeMap;
  console.log("user map", map);

  return {
    ...data,
    studyBlocks: data.studyBlocks.map((b) => processStudyBlock(parseStudyBlock(b), map)),
  };
}

export function processStudyBlock(rawStudyBlock: ParsedStudyBlock, gradeMap: GradeMap): ProcessedStudyBlock {
  const gpaMap: { [x: string]: string } = {
    "A+": "9",
    A: "8",
    "A-": "7",
    "B+": "6",
    B: "5",
    "B-": "4",
    "C+": "3",
    C: "2",
    "C-": "1",
  };

  const processedCourses = rawStudyBlock.subjects.map((rawSubject) => processCourseInfo(rawSubject, gradeMap));
  const r: ProcessedStudyBlock = {
    id: rawStudyBlock.id,
    name: rawStudyBlock.name,
    startDate: rawStudyBlock.startDate,
    endDate: rawStudyBlock.endDate,
    courses: processedCourses,
    gpaEstimate: calculateGpaBasedOnTable(processedCourses, gpaMap),
    usGpaEstimate: calculateGpaBasedOnTable(processedCourses, {
      "A+": "4",
      A: "4",
      "A-": "3.7",
      "B+": "3.3",
      B: "3",
      "B-": "2.7",
      "C+": "2.3",
      C: "2",
      "C-": "1.7",
    }),
  };
  return r;
}

export function processCourseInfo(course: ParsedCourse, gradeMap: GradeMap): ProcessedCourseInfo {
  let components = course.components.map((e) => processComponent(e, gradeMap));
  const response: ProcessedCourseInfo = {
    ...course,
    grades: {
      maximumPossible: calculateMaximumPossibleCourseGrade(course, gradeMap),
      actual: calculateActualCourseProgressGrade(course, gradeMap),
      projected: calculateProjectedCourseGrade(course, gradeMap),
    },
    status: {
      isCompleted: calculateIsCourseCompleted(course),
      componentsRemaining: components.filter((d) => {
        const grade = calculateActualGradeForComponent(d);
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
      actual: calculateActualGradeForComponent(component),
      maximum: calculateMaximumPossibleComponentGrade(component),
      projected: calculateProjectedGradeForComponent(component),
    },
  };
}

export type ProcessedStudyBlock = Omit<StudyBlock, "subjects"> & {
  courses: ProcessedCourseInfo[];
  gpaEstimate: CourseGrade;
  usGpaEstimate: CourseGrade;
};

export function calculateGpaBasedOnTable(
  processedCourses: ProcessedCourseInfo[],
  gpaMap: { [x: string]: string }
): {
  isUnknown: boolean;
  letter: string;
  numerical: Decimal;
} {
  let markTotal = new Decimal(0);
  for (let c of processedCourses) {
    if (gpaMap[c.grades.projected.letter]) markTotal = markTotal.plus(gpaMap[c.grades.projected.letter]);
  }
  markTotal = markTotal.div(processedCourses.length);
  let floored = markTotal.floor();

  return {
    isUnknown: false,
    letter: "TOBEIMPLEMENTED", //Object.values(gpaMap).includes(floored) ? Object.keys(gpaMap)[Object.values(gpaMap).indexOf(floored)] : "Unknown",
    numerical: markTotal,
  };
}
export type GradeMap = { [x: string]: string };

export interface GradeTriplet {
  maximum: ComponentGrade;
  actual: ComponentGrade;
  projected: ComponentGrade;
}
export interface ComponentGrade {
  value: Decimal;
  isAverage: boolean;
  isUnknown: boolean;
}

export type ProcessedCourseInfo = Omit<ParsedCourse, "components"> & {
  grades: {
    maximumPossible: CourseGrade;
    actual: CourseGrade;
    projected: CourseGrade;
  };
  status: {
    isCompleted: boolean;
    componentsRemaining: ProcessedCourseComponent[];
    gradeMap: GradeMap;
  };

  components: ProcessedCourseComponent[];
};

export type ProcessedCourseComponent = ParsedCourseComponent & {
  grades: GradeTriplet;
};

export type ObjectGrade = { numerical: Decimal; letter: string; isUnknown: boolean; isAverage: boolean };
export type CourseGrade = { numerical: Decimal; letter: string; isUnknown: boolean };

Decimal;
export function calculateIsCourseCompleted(course: ParsedCourse) {
  return (
    course.components.map(calculateActualGradeForComponent).filter((d) => !d.isUnknown && !d.isAverage).length === course.components.length
  );
}

export function calculateMaximumPossibleCourseGrade(subject: ParsedCourse, gradeMap: GradeMap): CourseGrade {
  if (!subject || !subject.components || subject.components.length === 0)
    return { numerical: new Decimal(0), letter: "Z", isUnknown: true };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateMaximumPossibleComponentGrade(g);
      return grade.value.mul(g.subjectWeighting);
    })
    .reduce((a, b) => a.add(b));
  return { numerical: numericalvalue, letter: calculateLetterGrade(numericalvalue, gradeMap), isUnknown: false };
}

export const UnknownCourseGrade: CourseGrade = { numerical: new Decimal(0), letter: "U", isUnknown: true };
export const UnknownGrade: ObjectGrade = { numerical: new Decimal(0), letter: "U", isUnknown: true, isAverage: false };

export function calculateAverageOfList(list: number[], drop: number): number | null {
  if (list.length === 0) return 0;
  if (list.length - drop <= 0) return null;
  const sorted = list
    .map((a) => a)
    .sort((a, b) => b - a)
    .slice(0, 0 - drop);
  return sorted.reduce((a, b) => a + b, 0) / sorted.length;
}

export function calculateActualCourseProgressGrade(subject: ParsedCourse, gradeMap: GradeMap): CourseGrade {
  if (!subject || !subject.components || subject.components.length === 0) return { numerical: new Decimal(0), letter: "", isUnknown: true };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateActualGradeForComponent(g);
      return grade.value.mul(g.subjectWeighting);
    })
    .reduce((a, b) => a.add(b));
  return { numerical: numericalvalue, letter: calculateLetterGrade(numericalvalue, gradeMap), isUnknown: false };
}

export function calculateProjectedCourseGrade(subject: ParsedCourse, gradeMap: GradeMap): CourseGrade {
  if (!subject.components || subject.components.length === 0) return { numerical: new Decimal(0), letter: "Z", isUnknown: false };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateProjectedGradeForComponent(g);
      return grade.value.mul(g.subjectWeighting);
    })
    .reduce((a, b) => a.add(b));
  var completedWeighting;
  var completedWeightingArr = subject.components.filter((d) => getActiveSubcomponents(d).length !== 0).map((g) => g.subjectWeighting);
  if (completedWeightingArr.length === 0) {
    completedWeighting = 1;
  } else {
    completedWeighting = completedWeightingArr.reduce((a, b) => a.add(b));
  }
  return {
    numerical: numericalvalue.div(completedWeighting),
    letter: calculateLetterGrade(numericalvalue.div(completedWeighting), gradeMap),
    isUnknown: false,
  };
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
  component: SubjectComponent,
  subcomponent: SubjectSubcomponent,
  overrideSubcomponents?: SubjectSubcomponent[]
): boolean {
  const subcomponents: SubjectSubcomponent[] = overrideSubcomponents ?? (component.subcomponents as SubjectSubcomponent[]) ?? [];
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

export function getUncompletedAndCompletedActiveSubcomponents(component: ParsedCourseComponent): ParsedCourseSubcomponent[] {
  var sorted = component.subcomponents
    .map((e) => e)
    .sort((first, second) => {
      if (first.gradeValuePercentage.lt(second.gradeValuePercentage)) return 1;
      if (first.gradeValuePercentage.eq(second.gradeValuePercentage)) return 0;
      return -1;
    });

  for (var i = 0; i < component.numberOfSubComponentsToDrop_Lowest; i++) {
    sorted.pop();
  }
  return sorted;
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

export function calculateActualGradeForComponent(component: ParsedCourseComponent): ComponentGrade {
  const active = getActiveSubcomponents(component);
  if (active.length === 0) return { value: new Decimal(0), isAverage: false, isUnknown: true };
  return {
    value: active
      .map((d) => d.gradeValuePercentage)
      .reduce((a, b) => a.add(b))
      .div(component.subcomponents.length - component.numberOfSubComponentsToDrop_Lowest),
    isAverage: component.subcomponents.filter((e) => !e.isCompleted).length !== 0,
    isUnknown: false,
  };
}

export function calculateMaximumPossibleComponentGrade(component: ParsedCourseComponent): ComponentGrade {
  const active = getUncompletedAndCompletedActiveSubcomponents(component);
  if (active.length === 0) return { value: new Decimal(0), isAverage: false, isUnknown: true };
  return {
    value: active
      .map((d) => (d.isCompleted ? d.gradeValuePercentage : new Decimal(1)))
      .reduce((a, b) => a.add(b))
      .div(component.subcomponents.length - component.numberOfSubComponentsToDrop_Lowest),
    isAverage: component.subcomponents.filter((e) => !e.isCompleted).length != 0,
    isUnknown: false,
  };
}

export function calculateProjectedGradeForComponent(component: ParsedCourseComponent): ComponentGrade {
  if (getActiveSubcomponents(component).length === 0) return { value: new Decimal(0), isAverage: false, isUnknown: true };
  return {
    value: getActiveSubcomponents(component)
      .map((d) => d.gradeValuePercentage)
      .reduce((a, b) => a.add(b))
      .div(getActiveSubcomponents(component).length),
    isAverage: component.subcomponents.filter((e) => !e.isCompleted).length != 0,
    isUnknown: false,
  };
}

export function adjust(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) => ("0" + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2))
  );
}

export function pickTextColorBasedOnBgColorAdvanced(bgColor: string, lightColor: string, darkColor: string): string {
  var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.46 ? darkColor : lightColor;
}
