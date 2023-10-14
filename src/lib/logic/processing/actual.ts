import Decimal from "decimal.js";
import { calculateLetterGrade, ComponentGrade, CourseGrade, getActiveSubcomponents, GradeMap } from ".";
import { ParsedCourse, ParsedCourseComponent } from "../parsing";

export function calculateActualCourseProgressGrade(subject: ParsedCourse, gradeMap: GradeMap): CourseGrade {
  if (!subject || !subject.components || subject.components.length === 0) return { value: new Decimal(0), letter: "", isUnknown: true };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateActualGradeForComponent(g, gradeMap);
      return grade.value.mul(g.subjectWeighting);
    })
    .reduce((a, b) => a.add(b));
  return { value: numericalvalue, letter: calculateLetterGrade(numericalvalue, gradeMap), isUnknown: false };
}

export function calculateActualGradeForComponent(component: ParsedCourseComponent, gradeMap: GradeMap): ComponentGrade {
  const active = getActiveSubcomponents(component);
  if (active.length === 0)
    return { value: new Decimal(0), letter: calculateLetterGrade(new Decimal(0), gradeMap), isAverage: false, isUnknown: true };

  let value = active
    .map((d) => d.gradeValuePercentage)
    .reduce((a, b) => a.add(b))
    .div(component.subcomponents.length - component.numberOfSubComponentsToDrop_Lowest);

  return {
    value,
    letter: calculateLetterGrade(value, gradeMap),
    isUnknown: false,
    isAverage: false,
  };
}
