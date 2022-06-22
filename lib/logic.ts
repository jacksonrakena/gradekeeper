import { SubjectSubcomponent } from "@prisma/client";
import { FullSubject, FullSubjectComponent } from "./fullEntities";

export function _null<T>(): T | null {
  return null;
}

export function _undefined<T>(): T | undefined {
  return undefined;
}

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
export { fetcher };

export function processCourseData(course: FullSubject, gradeMap: object) {
  const response = {
    grades: {
      maximumPossible: calculateMaximumPossibleCourseGrade(course, gradeMap),
      actual: calculateActualCourseProgressGrade(course, gradeMap),
      projected: calculateProjectedCourseGrade(course, gradeMap),
    },
    status: {
      isCompleted: calculateIsCourseCompleted(course),
      componentsRemaining: course.components.filter((d) => {
        const grade = calculateActualGradeForComponent(d);
        return grade.isAverage || grade.isUnknown;
      }),
    },
  };
  return response;
}

export type ObjectGrade = { numerical: number; letter: string; isUnknown: boolean; isAverage: boolean };
export type CourseGrade = { numerical: number; letter: string; isUnknown: true };
export function new_calculateProjectedCourseGrade(course: FullSubject, gradeMap: object) {}

export type ProcessedCourseData = ReturnType<typeof processCourseData>;

export function calculateIsCourseCompleted(course: FullSubject) {
  return (
    course.components.map(calculateActualGradeForComponent).filter((d) => !d.isUnknown && !d.isAverage).length === course.components.length
  );
}

export function calculateMaximumPossibleCourseGrade(subject: FullSubject, gradeMap: object): { numerical: number; letter: string } {
  if (!subject || !subject.components || subject.components.length === 0) return { numerical: 0, letter: "Z" };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateMaximumPossibleComponentGrade(g);
      console.log(g.name + ": " + grade.value * g.subjectWeighting);
      return grade.value * g.subjectWeighting;
    })
    .reduce((a, b) => a + b);
  return { numerical: numericalvalue, letter: calculateLetterGrade(numericalvalue, gradeMap) };
}

export const UnknownCourseGrade: CourseGrade = { numerical: 0, letter: "U", isUnknown: true };
export const UnknownGrade: ObjectGrade = { numerical: 0, letter: "U", isUnknown: true, isAverage: false };

/**
 * This function computes the projected grade of a course component.
 */
export function new_Component_calculateProjectedGrade(component: FullSubjectComponent, gradeMap: object): ObjectGrade {
  const completedSubcomponents = component.subcomponents.filter((e) => e.isCompleted);

  // The user has not completed any subcomponents.
  if (completedSubcomponents.length === 0) return { numerical: 0, letter: "U", isUnknown: true, isAverage: false };

  // Calculate the user's score on the subcomponents that they have completed.
  const scoreOnCompletedSubcomponents =
    completedSubcomponents.map((e) => e.gradeValuePercentage).reduce((a, b) => a + b, 0) / completedSubcomponents.length;

  return {
    numerical: scoreOnCompletedSubcomponents,
    isAverage: true,
    letter: calculateLetterGrade(scoreOnCompletedSubcomponents, gradeMap),
    isUnknown: false,
  };
}

export function new_Course_calculateProjectedGrade(course: FullSubject, gradeMap: object): CourseGrade {
  const projectedComponents = course.components.map((d) => ({ ...d, ...new_Component_calculateProjectedGrade(d, gradeMap) }));
  const knownComponents = projectedComponents.filter((e) => !e.isUnknown);
  if (knownComponents.length === 0) return UnknownCourseGrade;

  const projectedResult = knownComponents.map((e) => e.numerical).reduce((a, b) => a + b) / knownComponents.length;
  return {
    numerical: projectedResult,
    letter: calculateLetterGrade(projectedResult, gradeMap),
    isUnknown: true,
  };
}

export function calculateAverageOfList(list: number[], drop: number): number | null {
  if (list.length === 0) return 0;
  if (list.length - drop <= 0) return null;
  const sorted = list.sort((a, b) => b - a).slice(0, 0 - drop);
  return sorted.reduce((a, b) => a + b, 0) / sorted.length;
}

export type CalculatedGrade = {
  numerical: number;
  letter: string;
  isUnknown: boolean;
  isAverage: boolean;
};

export function calculateActualCourseProgressGrade(subject: FullSubject, gradeMap: object): { numerical: number; letter: string } {
  if (!subject || !subject.components || subject.components.length === 0) return { numerical: 0, letter: "Z" };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateActualGradeForComponent(g);
      return grade.value * g.subjectWeighting;
    })
    .reduce((a, b) => a + b);
  return { numerical: numericalvalue, letter: calculateLetterGrade(numericalvalue, gradeMap) };
}

export function calculateProjectedCourseGrade(
  subject: FullSubject,
  gradeMap: object
): { numerical: number; letter: string; isUnknown: boolean } {
  if (!subject.components || subject.components.length === 0) return { numerical: 0, letter: "Z", isUnknown: false };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = new_Component_calculateProjectedGrade(g, gradeMap);
      return grade.numerical * g.subjectWeighting;
    })
    .reduce((a, b) => a + b);
  var completedWeighting;
  var completedWeightingArr = subject.components.filter((d) => getActiveSubcomponents(d).length !== 0).map((g) => g.subjectWeighting);
  if (completedWeightingArr.length === 0) {
    completedWeighting = 1;
  } else {
    completedWeighting = completedWeightingArr.reduce((a, b) => a + b);
  }
  return {
    numerical: numericalvalue / completedWeighting,
    letter: calculateLetterGrade(numericalvalue / completedWeighting, gradeMap),
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
  component: FullSubjectComponent,
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

export function getUncompletedAndCompletedActiveSubcomponents(component: FullSubjectComponent): SubjectSubcomponent[] {
  var sorted = component.subcomponents
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

export function getActiveSubcomponents(component: FullSubjectComponent): SubjectSubcomponent[] {
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

export function calculateLetterGrade(val: number, gradeMap: any): string {
  const gradenumbers = Object.keys(gradeMap).map((e) => Number.parseFloat(e));
  var result =
    gradeMap[
      gradenumbers
        .sort()
        .filter((gradeNumber) => val >= gradeNumber)
        .pop()!
    ];
  if (!result) return "F";
  return result;
}

export function calculateActualGradeForComponent(component: FullSubjectComponent): {
  value: number;
  isAverage: boolean;
  isUnknown: boolean;
} {
  const active = getActiveSubcomponents(component);
  if (active.length === 0) return { value: 0, isAverage: false, isUnknown: true };
  return {
    value:
      active.map((d) => d.gradeValuePercentage).reduce((a, b) => a + b) /
      (component.subcomponents.length - component.numberOfSubComponentsToDrop_Lowest),
    isAverage: component.subcomponents.filter((e) => !e.isCompleted).length !== 0,
    isUnknown: false,
  };
}

export function calculateMaximumPossibleComponentGrade(component: FullSubjectComponent): {
  value: number;
  isAverage: boolean;
  isUnknown: boolean;
} {
  const active = getUncompletedAndCompletedActiveSubcomponents(component);
  if (active.length === 0) return { value: 0, isAverage: false, isUnknown: true };
  return {
    value:
      active.map((d) => (d.isCompleted ? d.gradeValuePercentage : 1)).reduce((a, b) => a + b) /
      (component.subcomponents.length - component.numberOfSubComponentsToDrop_Lowest),
    isAverage: component.subcomponents.filter((e) => !e.isCompleted).length != 0,
    isUnknown: false,
  };
}

export function calculateProjectedGradeForComponent(component: FullSubjectComponent): {
  value: number;
  isAverage: boolean;
  isUnknown: boolean;
} {
  if (getActiveSubcomponents(component).length === 0) return { value: 0, isAverage: false, isUnknown: true };
  return {
    value:
      getActiveSubcomponents(component)
        .map((d) => d.gradeValuePercentage)
        .reduce((a, b) => a + b) / getActiveSubcomponents(component).length,
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
