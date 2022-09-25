import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiImport } from "react-icons/bi";
import { CreateCourse } from "../../course/CreateCourse";
import { CourseImportModal } from "./CourseImportModal";

const CreateCourseModal = (props: { isOpen: boolean; onClose: () => void; blockId: string }) => {
  const [action, setAction] = useState("");
  return (
    <>
      <Modal
        size="4xl"
        isOpen={props.isOpen}
        onClose={() => {
          setAction("");
          props.onClose();
        }}
        preserveScrollBarGap={true}
      >
        <ModalOverlay />

        {!action ? (
          <>
            <ModalContent>
              <ModalHeader fontSize={"2xl"}>What do you want to do?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={6} pb={6}>
                  <Box cursor={"pointer"} onClick={() => setAction("create")} p={6} boxShadow={"lg"} rounded={"md"}>
                    <Flex>
                      <EditIcon w={12} h={12} mr={4} />
                      <Box>
                        <Heading size="md">Create a new course</Heading>
                        <Text>You'll need to provide the structure of the course.</Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Box cursor={"pointer"} p={6} onClick={() => setAction("import")} boxShadow={"lg"} rounded={"md"}>
                    <Flex>
                      <Icon as={BiImport} w={12} h={12} mr={4} />
                      <Box>
                        <Heading size="md">Import a course</Heading>
                        <Text>
                          You'll need the course <b>share code</b>.
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </Stack>
              </ModalBody>
            </ModalContent>
          </>
        ) : (
          <>
            {action === "create" ? (
              <>
                <ModalContent>
                  <ModalHeader>Create a new course</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <CreateCourse block_id={props.blockId} />
                  </ModalBody>
                </ModalContent>
              </>
            ) : (
              <>
                <CourseImportModal blockId={props.blockId} onClose={props.onClose} />
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
};
export default CreateCourseModal;
