import { Box } from "@chakra-ui/react";
import { ProcessedCourse } from "../../../../../lib/logic/processing";

const CourseCompletedWidget = (props: { course: ProcessedCourse }) => {
  // Realistically, these are the only two that will show up.
  const vowels: ReadonlyArray<string> = ["A", "E"];
 
  const isVowel: boolean = vowels.includes(props.course.grades.actual.letter[0]);

  return (
    <Box textAlign={"center"}>
      <Box>Congratulations, you got {isVowel ? "an" : "a"}</Box>
      <Box fontSize={48} color={props.course.color} fontWeight="bold">
        {props.course.grades.actual.letter}
      </Box>
      <Box>{props.course.grades.actual.value.mul(100).toPrecision(4)}%</Box>
    </Box>
  );
};

export default CourseCompletedWidget;
