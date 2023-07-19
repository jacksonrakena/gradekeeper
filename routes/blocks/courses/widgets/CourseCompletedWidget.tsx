import { Box } from "@chakra-ui/react";
import { ProcessedCourse } from "../../../../src/lib/logic/processing";

const CourseCompletedWidget = (props: { course: ProcessedCourse }) => {
  return (
    <Box textAlign={"center"}>
      <Box>Congratulations, you got an</Box>
      <Box fontSize={48} color={props.course.color} fontWeight="bold">
        {props.course.grades.actual.letter}
      </Box>
      <Box>{props.course.grades.actual.value.mul(100).toPrecision(4)}%</Box>
    </Box>
  );
};

export default CourseCompletedWidget;
