import Decimal from "decimal.js";
import { ComponentGrade, CourseGrade, GradeMap, calculateLetterGrade, getUncompletedAndCompletedActiveSubcomponents } from ".";
import { ParsedCourse, ParsedCourseComponent } from "../parsing";

export function calculateMaximumPossibleCourseGrade(subject: ParsedCourse, gradeMap: GradeMap): CourseGrade {
  if (!subject || !subject.components || subject.components.length === 0) return { value: new Decimal(0), letter: "Z", isUnknown: true };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateMaximumPossibleComponentGrade(g, gradeMap);
      return grade.value.mul(g.subjectWeighting);
    })
    .reduce((a, b) => a.add(b));
  return { value: numericalvalue, letter: calculateLetterGrade(numericalvalue, gradeMap), isUnknown: false };
}

export function calculateMaximumPossibleComponentGrade(component: ParsedCourseComponent, gradeMap: GradeMap): ComponentGrade {
  const active = getUncompletedAndCompletedActiveSubcomponents(component);
  if (active.length === 0)
    return { value: new Decimal(0), letter: calculateLetterGrade(new Decimal(0), gradeMap), isAverage: false, isUnknown: true };
  let value = active
    .map((d) => (d.isCompleted ? d.gradeValuePercentage : new Decimal(1)))
    .reduce((a, b) => a.add(b))
    .div(component.subcomponents.length - component.numberOfSubComponentsToDrop_Lowest);
  return {
    value: value,
    isAverage: component.subcomponents.filter((e) => !e.isCompleted).length != 0,
    isUnknown: false,
    letter: calculateLetterGrade(value, gradeMap),
  };
}
