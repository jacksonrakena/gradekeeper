import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUserContext } from "../../UserContext";

export const CourseImportModal = (props: { blockId: string; onClose: () => void }) => {
  const [shareCode, setShareCode] = useState("");
  const user = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const targetStudyBlock = props.blockId;
  return (
    <ModalContent>
      <ModalHeader>Import a course</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box mb={4}>
          This feature allows you to copy a course structure from a friend, by using the course <strong>share code.</strong>
          <FormControl my={4}>
            <FormLabel>Course share code</FormLabel>
            <Input onChange={(e) => setShareCode(e.target.value)} value={shareCode} />
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
            props.onClose();
          }}
          colorScheme={"teal"}
        >
          Import
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
