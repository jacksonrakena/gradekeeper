import Decimal from "decimal.js";
import { ComponentGrade, CourseGrade, GradeMap, calculateLetterGrade, getActiveSubcomponents } from ".";
import { ParsedCourse, ParsedCourseComponent } from "../parsing";

export function calculateProjectedCourseGrade(subject: ParsedCourse, gradeMap: GradeMap): CourseGrade {
  if (!subject.components || subject.components.length === 0) return { value: new Decimal(0), letter: "Z", isUnknown: false };
  const numericalvalue = subject.components
    ?.map((g) => {
      const grade = calculateProjectedGradeForComponent(g, gradeMap);
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
    value: numericalvalue.div(completedWeighting),
    letter: calculateLetterGrade(numericalvalue.div(completedWeighting), gradeMap),
    isUnknown: false,
  };
}

export function calculateProjectedGradeForComponent(component: ParsedCourseComponent, gradeMap: GradeMap): ComponentGrade {
  if (getActiveSubcomponents(component).length === 0) return { value: new Decimal(0), letter: "Z", isAverage: false, isUnknown: true };
  let value = getActiveSubcomponents(component)
    .map((d) => d.gradeValuePercentage)
    .reduce((a, b) => a.add(b))
    .div(getActiveSubcomponents(component).length);
  return {
    value: value,
    letter: calculateLetterGrade(value, gradeMap),
    isAverage: component.subcomponents.filter((e) => !e.isCompleted).length != 0,
    isUnknown: false,
  };
}
