import { Course } from "@/lib/logic/types";
import { routes, useApi } from "@/lib/net/fetch";
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
import { useNavigate } from "react-router";
import { useInvalidator } from "../../../lib/state/course";

export const CourseImportModal = (props: { blockId: string; onClose: () => void }) => {
  const [shareCode, setShareCode] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const targetStudyBlock = props.blockId;
  const { invalidate } = useInvalidator();
  const api = useApi();
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
            const course = await api.post<Course>(routes.block(targetStudyBlock).importCourse(), {
              shareCode: shareCode,
            });
            if (course) {
              await invalidate();
              navigate(`/blocks/${targetStudyBlock}/courses/${course.id}`);
              setLoading(false);
              props.onClose();
              toast({
                title: `Imported ${course.courseCodeName} ${course.courseCodeNumber} successfully.`,
                status: "success",
                duration: 4000,
              });
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
