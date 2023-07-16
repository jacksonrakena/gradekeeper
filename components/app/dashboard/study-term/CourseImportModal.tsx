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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useInvalidator } from "../../../../state/course";

export const CourseImportModal = (props: { blockId: string; onClose: () => void }) => {
  const [shareCode, setShareCode] = useState("");
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const targetStudyBlock = props.blockId;
  const { invalidate } = useInvalidator();
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
            const res = await fetch(`/api/block/${targetStudyBlock}/import`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ shareCode: shareCode }),
            });
            if (res.ok) {
              const course = await res.json();
              await invalidate();
              router.push(`/blocks/${targetStudyBlock}/courses/${course.id}`);
              setLoading(false);
              props.onClose();
              toast({
                title: `Imported ${course.courseCodeName} ${course.courseCodeNumber} successfully.`,
                status: "success",
                duration: 4000,
              });
            } else {
              setLoading(false);
              if (res.status === 404) {
                toast({
                  title: "Course not found.",
                  description: "Check the share code.",
                  duration: 4000,
                  status: "error",
                });
              }
            }
          }}
          colorScheme={"brand"}
        >
          Import
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
