import Decimal from "decimal.js";
import { calculateLetterGrade, CourseGrade, GradeMap, ProcessedCourse } from ".";

export type GpaTable = { [x: string]: string };

export const NzGpaTable: GpaTable = {
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
export const UsGpaTable: GpaTable = {
  "A+": "4",
  A: "4",
  "A-": "3.7",
  "B+": "3.3",
  B: "3",
  "B-": "2.7",
  "C+": "2.3",
  C: "2",
  "C-": "1.7",
};

function reversed(object: any) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
}
export function calculateGpaBasedOnTable(processedCourses: ProcessedCourse[], gpaMap: GpaTable): CourseGrade {
  if (processedCourses.length === 0) {
    return {
      isUnknown: true,
      letter: "Z",
      value: new Decimal(0),
    };
  }
  let markTotal = new Decimal(0);
  for (let c of processedCourses) {
    if (gpaMap[c.grades.projected.letter]) markTotal = markTotal.plus(new Decimal(gpaMap[c.grades.projected.letter]));
  }
  markTotal = markTotal.div(processedCourses.length);

  return {
    isUnknown: false,
    letter: calculateLetterGrade(markTotal, reversed(gpaMap)),
    value: markTotal,
  };
}

export function calculateAusWam(processedCourses: ProcessedCourse[], userGradeMap: GradeMap): CourseGrade {
  if (processedCourses.length === 0) {
    return {
      isUnknown: true,
      letter: "Z",
      value: new Decimal(0),
    };
  }

  let wam = processedCourses.reduce((a, v) => a.add(v.grades.projected.value), new Decimal(0)).div(processedCourses.length);
  return {
    isUnknown: false,
    letter: calculateLetterGrade(wam, userGradeMap),
    value: wam,
  };
}
