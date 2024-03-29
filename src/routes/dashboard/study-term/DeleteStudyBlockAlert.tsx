import { routes, useApi } from "@/lib/net/fetch";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ProcessedStudyBlock } from "../../../lib/logic/processing";
import { useInvalidator } from "../../../lib/state/course";

export const DeleteStudyBlockAlert = (props: {
  isDeleteOpen: boolean;
  setIsDeleteOpen: (value: boolean) => void;
  studyBlock: ProcessedStudyBlock;
}) => {
  const cancelRef = useRef<any>();
  const { updateStudyBlock } = useInvalidator();
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();
  const api = useApi();
  return (
    <AlertDialog
      isOpen={props.isDeleteOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => {
        props.setIsDeleteOpen(false);
      }}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete block &lsquo;{props.studyBlock.name}&rsquo;
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you <strong>sure</strong> you want to delete {props.studyBlock.name}? <br />
            This will delete <strong>{props.studyBlock.courses.length}</strong> courses.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={() => {
                props.setIsDeleteOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                setIsDeleting(true);
                const response = await api.delete(routes.block(props.studyBlock?.id ?? "").delete());
                if (response) {
                  updateStudyBlock(props.studyBlock?.id, null);
                  toast({
                    title: "Study block deleted.",
                    description: props.studyBlock?.name + " deleted.",
                    duration: 4000,
                    isClosable: true,
                    status: "success",
                  });

                  props.setIsDeleteOpen(false);
                }
                setIsDeleting(false);
              }}
              isLoading={isDeleting}
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
