import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import router from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { ProcessedStudyBlock } from "../../../../lib/logic/processing";
import { ProcessedUserState } from "../../../../state/course";
import CoursePill, { Pill } from "./CoursePill";
import CreateCourseModal from "./CreateCourseModal";
import { DeleteStudyBlockAlert } from "./DeleteStudyBlockAlert";

const StudyBlockCourseList = (props: { studyBlock: ProcessedStudyBlock }) => {
  const studyBlock = props.studyBlock;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const courseCreateDisclosure = useDisclosure();
  const user = useRecoilValue(ProcessedUserState);
  const sbStart = new Date(studyBlock.startDate);
  const sbEnd = new Date(studyBlock.endDate);
  const dtf = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (!user) return <></>;
  return (
    <>
      <CreateCourseModal blockId={studyBlock.id} {...courseCreateDisclosure} />
      <DeleteStudyBlockAlert isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} studyBlock={studyBlock} />
      <Box mb={12} key={studyBlock.id}>
        <Heading size="lg">
          {studyBlock.name}

          <IconButton
            onClick={() => {
              setIsDeleteOpen(true);
            }}
            className="ml-4"
            icon={<DeleteIcon />}
            size="xs"
            aria-label={"Delete"}
            colorScheme="brand"
          />
        </Heading>

        <Text>
          {dtf.format(sbStart)} &#8212; {dtf.format(sbEnd)}
        </Text>

        {studyBlock.processedCourses.map((subject) => (
          <CoursePill
            key={subject.id}
            onClick={() => {
              router.push(`/blocks/${studyBlock.id}/courses/${subject.id}`);
            }}
            subject={subject}
          />
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