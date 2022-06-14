import { SubjectSubcomponent } from "@prisma/client";
import { FullSubject, FullSubjectComponent } from "./fullEntities";

export function _null<T>(): T | null {
  return null;
}

const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
export { fetcher };

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
      const grade = calculateProjectedGradeForComponent(g);
      return grade.value * g.subjectWeighting;
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

export function randomColor(): string {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function isActiveSubcomponent(component: FullSubjectComponent, subcomponent: SubjectSubcomponent): boolean {
  var sorted = component.subcomponents
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

export function getActiveSubcomponents(component: FullSubjectComponent): SubjectSubcomponent[] {
  var sorted = component.subcomponents
    .filter((d) => d.isCompleted)
    .sort((first, second) => {
      if (first.gradeValuePercentage < second.gradeValuePercentage) return 1;
      if (first.gradeValuePercentage === second.gradeValuePercentage) return 0;
      return -1;
    });

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
