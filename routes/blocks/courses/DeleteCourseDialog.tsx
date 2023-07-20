import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  UseDisclosureReturn,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ProcessedCourse } from "../../../src/lib/logic/processing";
import { routes, useFetcher } from "../../../src/lib/net/fetch";
import { useInvalidator } from "../../../src/lib/state/course";

export const DeleteCourseDialog = (props: { disclosure: UseDisclosureReturn; course: ProcessedCourse }) => {
  const cancellationRef = useRef<any>();
  const [deleting, setDeleting] = useState(false);
  const fetcher = useFetcher();
  const toast = useToast();
  const navigate = useNavigate();
  const { updateCourse } = useInvalidator();
  return (
    <AlertDialog isOpen={props.disclosure.isOpen} leastDestructiveRef={cancellationRef} onClose={props.disclosure.onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete course &lsquo;{props.course.longName}&rsquo;
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you <strong>sure</strong> you want to delete {props.course.longName}? <br />
            This will delete <strong>all</strong> results.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancellationRef} onClick={props.disclosure.onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                setDeleting(true);
                const response = await fetcher.request(routes.block(props.course.studyBlockId).course(props.course.id).delete(), {
                  method: "DELETE",
                });
                if (response) {
                  toast({
                    title: "Course deleted.",
                    description: props.course.courseCodeName + " " + props.course.courseCodeNumber + " deleted.",
                    duration: 4000,
                    isClosable: true,
                    status: "success",
                  });
                  navigate("/");
                  updateCourse(props.course.id, null);
                }
              }}
              isLoading={deleting}
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
