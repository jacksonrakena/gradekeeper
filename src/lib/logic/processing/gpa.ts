import Decimal from "decimal.js";
import { CourseGrade, ProcessedCourse } from ".";

export type GpaTable = { [x: string]: string };

export const NzGpaTable: GpaTable = {
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

export function calculateGpaBasedOnTable(processedCourses: ProcessedCourse[], gpaMap: GpaTable): CourseGrade {
  let markTotal = new Decimal(0);
  for (let c of processedCourses) {
    if (gpaMap[c.grades.projected.letter]) markTotal = markTotal.plus(gpaMap[c.grades.projected.letter]);
  }
  markTotal = markTotal.div(processedCourses.length);
  let floored = markTotal.floor();

  return {
    isUnknown: false,
    letter: "TOBEIMPLEMENTED", //Object.values(gpaMap).includes(floored) ? Object.keys(gpaMap)[Object.values(gpaMap).indexOf(floored)] : "Unknown",
    value: markTotal,
  };
}
