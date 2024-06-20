import { DeleteCourseDialog } from "@/components/app/course/DeleteCourseDialog";
import { Editable } from "@/components/generic/Editable";
import { preferenceColor } from "@/lib/colors";
import { ProcessedCourse, ProcessedStudyBlock } from "@/lib/logic/processing";
import { Course } from "@/lib/logic/types";
import { routes, useApi } from "@/lib/net/fetch";
import { useInvalidator } from "@/lib/state/course";
import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, HStack, IconButton, Text, useClipboard, useDisclosure, useTheme } from "@chakra-ui/react";

export const CourseBanner = ({ course, studyBlock }: { course: ProcessedCourse; studyBlock: ProcessedStudyBlock }) => {
  const theme = useTheme();
  const clipboard = useClipboard(course.id);
  const fetcher = useApi();
  const { updateCourse } = useInvalidator();
  const deletionDisclosure = useDisclosure();
  return (
    <Box
      bgColor={course?.color}
      color={preferenceColor(course?.color, theme.colors.brand["900"], theme.colors.brand["100"])}
      className="p-8"
    >
      <DeleteCourseDialog course={course} disclosure={deletionDisclosure} />
      <Flex className="text-3xl">
        <Box display="inline" className="mr-4">
          <Editable
            displayProps={{ fontWeight: "semibold" }}
            onSubmit={async (n) => {
              const data = await fetcher.post<Course>(routes.block(studyBlock.id).course(course.id).update(), { courseCodeName: n });
              if (data) {
                updateCourse(data.id, (e) => data);
              }
            }}
            backingValue={course.courseCodeName}
          />
          {course.courseCodeName && " "}
          <Editable
            displayProps={{ fontWeight: "semibold" }}
            onSubmit={async (n) => {
              const data = await fetcher.post<Course>(routes.block(studyBlock.id).course(course.id).update(), { courseCodeNumber: n });
              if (data) {
                updateCourse(data.id, (e) => data);
              }
            }}
            backingValue={course.courseCodeNumber}
          />
        </Box>

        <Editable
          onSubmit={async (n) => {
            const data = await fetcher.post<Course>(routes.block(studyBlock.id).course(course.id).update(), { longName: n });
            if (data) {
              updateCourse(data.id, (e) => data);
            }
          }}
          backingValue={course.longName}
        />
      </Flex>
      <Box className="text-xl">
        <HStack spacing={10} className="mr-4">
          <Text>{studyBlock?.name}</Text>

          <HStack>
            <IconButton
              onClick={() => {
                deletionDisclosure.onOpen();
              }}
              icon={<DeleteIcon />}
              size="xs"
              aria-label={"Delete"}
              colorScheme="brand"
            />
            <Button size="xs" onClick={clipboard.onCopy} colorScheme="brand" disabled={clipboard.hasCopied}>
              {clipboard.hasCopied ? "Copied" : "Copy share code"}
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};
