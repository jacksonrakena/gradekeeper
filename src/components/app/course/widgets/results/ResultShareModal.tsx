import { ProcessedCourse, ProcessedCourseComponent } from "@/lib/logic/processing";
import {
  Box,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  UseDisclosureReturn,
  VStack,
} from "@chakra-ui/react";
import { BsCheckCircleFill } from "react-icons/bs";

export const ResultShareModal = (props: {
  course: ProcessedCourse;
  disclosure: UseDisclosureReturn;
  component: ProcessedCourseComponent;
  subcomponentId?: string;
}) => {
  return (
    <>
      <Modal size="xs" {...props.disclosure} preserveScrollBarGap={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalBody>
            <Stack alignItems={"center"} spacing={4}>
              <VStack>
                <Heading color={props.course.color}>
                  {props.course.courseCodeName} {props.course.courseCodeNumber}
                </Heading>
                <Heading>{props.component.name}</Heading>
              </VStack>

              <Stack spacing={4}>
                <Stack>
                  <Heading size="lg">{props.component.grades.actual.letter}</Heading>
                  <Box fontSize="lg">{props.component.grades.actual.value.mul(100).toString()}%</Box>
                </Stack>
                <Icon color={props.course.color} as={BsCheckCircleFill} w={8} h={8} />
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};
