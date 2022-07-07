import { Icon, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { BsCheckCircleFill } from "react-icons/bs";
import { FullSubject } from "../../../lib/fullEntities";
import { processCourseData } from "../../../lib/logic";
import themeConstants from "../../../lib/theme/themeConstants";

const CoursePill = (props: { subject: FullSubject; gradeMap: any; onClick: () => any }) => {
  const processed = processCourseData(props.subject, props.gradeMap);
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
      {!processed.status.isCompleted ? (
        <>
          <div className="flex">
            <div style={{ textAlign: "center" }} className=" flex flex-col">
              {processed.grades.projected.numerical === 0 ? (
                <Tag px={3} my={3} colorScheme={"teal"}>
                  No data
                </Tag>
              ) : (
                <>
                  <span style={{ fontWeight: "bold" }}>{processed.grades.projected.letter}</span>
                  <span>{(processed.grades.projected.numerical * 100).toFixed(2)}%</span>
                </>
              )}
            </div>

            <div className="py-3 px-4 flex grow">
              <div style={{ backgroundColor: "#D9D9D9" }} className="rounded flex grow">
                <div
                  style={{ backgroundColor: subject.color, width: "" + processed.grades.projected.numerical * 100 + "%" }}
                  className="rounded"
                ></div>
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
                {processed.grades.actual.letter}
              </Text>
              <Text>{(processed.grades.actual.numerical * 100).toFixed(2)}%</Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoursePill;
