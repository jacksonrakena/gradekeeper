import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { FullSubject } from "../../../lib/fullEntities";
import { calculateProjectedCourseGrade } from "../../../lib/logic";
import themeConstants from "../../../themeConstants";

const CoursePill = (props: { subject: FullSubject; gradeMap: any; onClick: () => any }) => {
  const grade = calculateProjectedCourseGrade(props.subject, props.gradeMap);
  const subject = props.subject;
  return (
    <div
      className="my-4 shadow-md hover:cursor-pointer"
      onClick={props.onClick}
      style={{
        padding: "10px",
        paddingLeft: "25px",
        borderRadius: "0.6rem",
        maxWidth: "800px",
        display: "block",
        backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor),
      }}
    >
      <Text size="md">
        <span style={{ color: subject.color }} className="pr-4">
          {subject.courseCodeName} {subject.courseCodeNumber}
        </span>
        <span style={{ fontWeight: "bold" }}>{subject.longName}</span>
      </Text>
      {grade.numerical === 0 ? (
        <Box py={3} px={4}>
          <Text size={"sm"}>No data, yet.</Text>
        </Box>
      ) : (
        <div className="flex">
          <div style={{ textAlign: "center" }} className="flex flex-col">
            <span style={{ fontWeight: "bold" }}>{grade.letter}</span>
            <span>{(grade.numerical * 100).toFixed(2)}%</span>
          </div>

          <div className="py-3 px-4 flex grow">
            <div style={{ backgroundColor: "#D9D9D9" }} className="rounded flex grow">
              <div style={{ backgroundColor: subject.color, width: "" + grade.numerical * 100 + "%" }} className="rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePill;
