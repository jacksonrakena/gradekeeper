import { Icon, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { FullSubject } from "../../../lib/fullEntities";
import { calculateIsCourseCompleted, calculateProjectedCourseGrade } from "../../../lib/logic";
import themeConstants from "../../../lib/theme/themeConstants";
import { BsCheckCircleFill } from "react-icons/bs";

const CoursePill = (props: { subject: FullSubject; gradeMap: any; onClick: () => any }) => {
  const grade = calculateProjectedCourseGrade(props.subject, props.gradeMap);
  const completed = calculateIsCourseCompleted(props.subject);
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
        <span style={{ fontWeight: "bold" }}>{subject.longName} </span>
      </Text>
      {!completed ? (
        <>
          <div className="flex">
            <div style={{ textAlign: "center" }} className=" flex flex-col">
              {grade.numerical === 0 ? (
                <Tag px={3} my={3} colorScheme={"teal"}>
                  No data
                </Tag>
              ) : (
                <>
                  <span style={{ fontWeight: "bold" }}>{grade.letter}</span>
                  <span>{(grade.numerical * 100).toFixed(2)}%</span>
                </>
              )}
            </div>

            <div className="py-3 px-4 flex grow">
              <div style={{ backgroundColor: "#D9D9D9" }} className="rounded flex grow">
                <div style={{ backgroundColor: subject.color, width: "" + grade.numerical * 100 + "%" }} className="rounded"></div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <Icon color={subject.color} as={BsCheckCircleFill} w={4} h={4} mr={2} />
              <Text style={{ fontWeight: "bold" }} mr={2}>
                {grade.letter}
              </Text>
              <Text>{(grade.numerical * 100).toFixed(2)}%</Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoursePill;
