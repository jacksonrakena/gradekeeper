import { Box, Flex, HStack, Icon, Tag, Text } from "@chakra-ui/react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { Pill } from "../../../components/generic/Pill";
import { ProcessedCourse, ProcessedStudyBlock } from "../../../lib/logic/processing";

const CoursePill = ({ studyBlock, course }: { studyBlock: ProcessedStudyBlock; course: ProcessedCourse }) => {
  const navigate = useNavigate();
  return (
    <Pill
      boxProps={{
        onClick: () => {
          navigate(`/blocks/${studyBlock.id}/courses/${course.id}`);
        },
      }}
    >
      <Box fontWeight={"semibold"}>
        <Text display={"inline"} color={course.color} pr={4}>
          {course.courseCodeName} {course.courseCodeNumber}
        </Text>
        <Text display={"inline"} fontWeight={"bold"}>
          {course.longName}
        </Text>
      </Box>

      {!course.status.isCompleted ? (
        <Flex>
          <Flex direction={"column"} textAlign={"center"}>
            {course.grades.projected.value.eq(0) ? (
              <Tag px={3} my={3} colorScheme={"brand"}>
                No data
              </Tag>
            ) : (
              <Flex flexDir={"column"} mx={2}>
                <span style={{ fontWeight: "bold" }}>{course.grades.projected.letter}</span>
                <span>{course.grades.projected.value.mul(100).toFixed(2)}%</span>
              </Flex>
            )}
          </Flex>

          <Flex grow={1} bgColor="#D9D9D9" className="rounded" mx={4} my={3}>
            <Box bgColor={course.color} width={course.grades.projected.value.mul(100) + "%"} className="rounded"></Box>
          </Flex>
        </Flex>
      ) : (
        <HStack justifyContent={"center"}>
          <Icon color={course.color} as={BsCheckCircleFill} w={4} h={4} />
          <Text fontWeight="bold">{course.grades.actual.letter}</Text>
          <Text>{course.grades.actual.value.mul(100).toDecimalPlaces(2).toString()}%</Text>
        </HStack>
      )}
    </Pill>
  );
};

export default CoursePill;
