import { Box } from "@chakra-ui/react";
import { FullSubject } from "../../../lib/fullEntities";
import { ProcessedCourseData } from "../../../lib/logic";

const CourseCompletedWidget = (props: { course: FullSubject; processed: ProcessedCourseData }) => {
  return (
    <Box textAlign={"center"}>
      <Box>Congratulations, you got an</Box>
      <Box fontSize={48} color={props.course.color} fontWeight="bold">
        {props.processed.grades.actual.letter}
      </Box>
      <Box>{(props.processed.grades.actual.numerical * 100).toPrecision(4)}%</Box>
    </Box>
  );
};

export default CourseCompletedWidget;
