import { Box, Flex, Icon, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { BsCheckCircleFill } from "react-icons/bs";
import { ProcessedCourseInfo } from "../../../../lib/logic/processing";
import themeConstants from "../../../../lib/theme/themeConstants";

const CoursePill = (props: { subject: ProcessedCourseInfo; onClick: () => any }) => {
  const subject = props.subject;
  return (
    <Box
      className="my-4 shadow-md hover:cursor-pointer"
      onClick={props.onClick}
      style={{
        padding: "10px",
        paddingLeft: "25px",
        borderRadius: "0.6rem",
        maxWidth: "800px",
        display: "block",
        backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor),
        transition: "0.25s",
        WebkitFilter: "blur(0)",
        msFilter: "blur(0)",
        filter: "none",
      }}
      _hover={{
        transform: "scale(1.01)",
      }}
    >
      <Text size="md" fontWeight={"semibold"}>
        <span style={{ color: subject.color }} className="pr-4">
          {subject.courseCodeName} {subject.courseCodeNumber}
        </span>
        <span style={{ fontWeight: "bold" }}>{subject.longName} </span>
      </Text>
      {!subject.status.isCompleted ? (
        <>
          <div className="flex">
            <Box style={{ textAlign: "center" }} className=" flex flex-col">
              {subject.grades.projected.numerical === 0 ? (
                <Tag px={3} my={3} colorScheme={"brand"}>
                  No data
                </Tag>
              ) : (
                <Flex flexDir={"column"} mx={2}>
                  <span style={{ fontWeight: "bold" }}>{subject.grades.projected.letter}</span>
                  <span>{(subject.grades.projected.numerical * 100).toFixed(2)}%</span>
                </Flex>
              )}
            </Box>

            <div className="py-3 px-4 flex grow">
              <div style={{ backgroundColor: "#D9D9D9" }} className="rounded flex grow">
                <div
                  style={{ backgroundColor: subject.color, width: "" + subject.grades.projected.numerical * 100 + "%" }}
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
                {subject.grades.actual.letter}
              </Text>
              <Text>{(subject.grades.actual.numerical * 100).toFixed(2)}%</Text>
            </div>
          </div>
        </>
      )}
    </Box>
  );
};

export default CoursePill;
