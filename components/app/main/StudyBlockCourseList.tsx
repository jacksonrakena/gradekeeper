import { DeleteIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Heading, IconButton } from "@chakra-ui/react";
import router from "next/router";
import { BsPlusLg } from "react-icons/bs";
import { ProcessedStudyBlock } from "../../../lib/logic";
import { useUserContext } from "../../../lib/UserContext";
import CoursePill from "./CoursePill";

const StudyBlockCourseList = (props: {
  studyBlock: ProcessedStudyBlock;
  setCourseCreateBlockId: (id: string) => void;
  setDeleteStudyBlock: (block: ProcessedStudyBlock) => void;
}) => {
  const studyBlock = props.studyBlock;
  const userContext = useUserContext();
  const user = userContext.user;
  const sbStart = new Date(studyBlock.startDate);
  const sbEnd = new Date(studyBlock.endDate);
  const dtf = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (!user) return <></>;
  return (
    <div key={studyBlock.id} className="mb-12">
      <div className="flex">
        <Heading size="lg">
          {studyBlock.name}
          <IconButton
            className="ml-4"
            size="xs"
            aria-label={"Create"}
            colorScheme={"blue"}
            icon={<BsPlusLg />}
            onClick={() => props.setCourseCreateBlockId(studyBlock.id)}
          />
          <IconButton
            onClick={() => {
              props.setDeleteStudyBlock(studyBlock);
            }}
            className="ml-4"
            icon={<DeleteIcon />}
            size="xs"
            aria-label={"Delete"}
            colorScheme="teal"
          />
        </Heading>
      </div>
      <div className="text-md">
        {dtf.format(sbStart)} &#8212; {dtf.format(sbEnd)}
      </div>

      {user.processedStudyBlocks.length === 1 && studyBlock.processedCourses.length === 0 && (
        <Box mt={4}>
          <Alert>
            <AlertIcon />
            <AlertTitle>Great job!</AlertTitle>
            <AlertDescription>Now, let&apos;s make a course in {studyBlock.name}.</AlertDescription>
          </Alert>
        </Box>
      )}
      {user.processedStudyBlocks.length > 1 && studyBlock.processedCourses.length === 0 && (
        <Box mt={4}>
          <Alert>
            <AlertIcon />
            <AlertDescription>This term has no courses.</AlertDescription>
          </Alert>
        </Box>
      )}

      {studyBlock.processedCourses.map((subject) => (
        <CoursePill
          key={subject.id}
          onClick={() => {
            router.push(`/blocks/${studyBlock.id}/courses/${subject.id}`);
          }}
          subject={subject}
        />
      ))}
    </div>
  );
};

export { StudyBlockCourseList };
