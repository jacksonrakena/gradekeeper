import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUserContext } from "../../UserContext";

export const CourseImportModal = (props: { disclosure: UseDisclosureProps }) => {
  const [shareCode, setShareCode] = useState("");
  const user = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [targetStudyBlock, setTargetStudyBlock] = useState(
    !!user?.user?.studyBlocks && user?.user.studyBlocks.length > 0 ? user?.user?.studyBlocks[0].id : ""
  );
  return (
    <Modal isOpen={props.disclosure.isOpen!!} onClose={props.disclosure.onClose!!}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import a course</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            This feature allows you to copy a course structure from another user, by using the course <strong>share code.</strong>
            <FormControl my={4}>
              <FormLabel>Course share code</FormLabel>
              <Input onChange={(e) => setShareCode(e.target.value)} value={shareCode} />
            </FormControl>
            <FormControl my={4}>
              <FormLabel>Add to study block</FormLabel>
              <Select
                onChange={(e) => {
                  setTargetStudyBlock(e.target.value);
                }}
              >
                {user?.user?.studyBlocks.map((sb) => (
                  <option value={sb.id}>{sb.name}</option>
                ))}
              </Select>
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              const course = await fetch(`/api/block/${targetStudyBlock}/import`, {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ shareCode: shareCode }),
              }).then((d) => d.json());
              await user.redownload();
              router.push(`/blocks/${targetStudyBlock}/courses/${course.id}`);
              setLoading(false);
              props.disclosure.onClose();
            }}
            colorScheme={"teal"}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
