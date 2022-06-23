import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { CreateBlock } from "../block/CreateBlock";

const CreateBlockModal = (props: { isOpen: boolean; onClose: () => void }) => {
  return (
    <>
      <Modal size="xl" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new study block</ModalHeader>
          <ModalBody>
            <CreateBlock onClose={props.onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateBlockModal;
