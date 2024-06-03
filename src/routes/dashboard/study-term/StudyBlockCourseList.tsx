import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, Heading, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { Pill } from "../../../components/generic/Pill";
import { ProcessedStudyBlock } from "../../../lib/logic/processing";
import CoursePill from "./CoursePill";
import CreateCourseModal from "./CreateCourseModal";
import { DeleteStudyBlockAlert } from "./DeleteStudyBlockAlert";

const StudyBlockCourseList = ({ studyBlock }: { studyBlock: ProcessedStudyBlock }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const courseCreateDisclosure = useDisclosure();
  const sbStart = new Date(studyBlock.startDate);
  const sbEnd = new Date(studyBlock.endDate);
  const dtf = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <>
      <CreateCourseModal blockId={studyBlock.id} {...courseCreateDisclosure} />
      <DeleteStudyBlockAlert isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} studyBlock={studyBlock} />
      <Box mb={12} key={studyBlock.id}>
        <HStack alignItems={"center"} spacing={4}>
          <Heading size="lg">{studyBlock.name}</Heading>

          <IconButton
            onClick={() => {
              setIsDeleteOpen(true);
            }}
            icon={<DeleteIcon />}
            size="xs"
            aria-label={"Delete"}
            colorScheme="brand"
          />
        </HStack>

        <Text>
          {dtf.format(sbStart)} &mdash; {dtf.format(sbEnd)}
        </Text>

        {!studyBlock.gpaEstimate?.value.isZero() && (
          <Text color={"GrayText"}>
            GPA estimate: NZ {studyBlock.gpaEstimate?.value.toDecimalPlaces(2).toString()} ({studyBlock.gpaEstimate?.letter}) &bull; US{" "}
            {studyBlock.usGpaEstimate?.value.toDecimalPlaces(2).toString()} ({studyBlock.usGpaEstimate?.letter})
          </Text>
        )}

        {studyBlock.courses.map((course) => (
          <CoursePill key={course.id} course={course} studyBlock={studyBlock} />
        ))}
        <Pill
          boxProps={{
            onClick: courseCreateDisclosure.onOpen,
          }}
        >
          <Flex alignItems={"center"}>
            <AddIcon w={3} h={3} mr={2} />
            <Text>Create new course</Text>
          </Flex>
        </Pill>
      </Box>
    </>
  );
};

export { StudyBlockCourseList };
