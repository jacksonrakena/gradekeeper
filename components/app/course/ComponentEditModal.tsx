import { SubjectSubcomponent } from ".prisma/client";
import { Button } from "@chakra-ui/button";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Box, Input, Text, useColorModeValue } from "@chakra-ui/react";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useRef, useState } from "react";
import { FullSubjectComponent } from "../../../lib/fullEntities";
import { calculateLetterGrade, isActiveSubcomponent } from "../../../lib/logic";
import { useUserContext } from "../../../UserContext";

const ComponentEditModal = (props: {
  blockId: string;
  gradeMap: any;
  showing: boolean;
  component: FullSubjectComponent | null;
  onClose: () => void;
  subject?: FullSubject;
  onReceiveUpdatedData: (data: FullSubjectComponent) => void;
}) => {
  const captionColor = useColorModeValue("gray.700", "gray.200");
  const userContext = useUserContext();
  const [subcomponents, setSubcomponents] = useState(props.component?.subcomponents ?? []);
  const [loading, setLoading] = useState(false);
  const previousValueRef = useRef<SubjectSubcomponent[]>(subcomponents);
  const previousValue = previousValueRef.current;
  const isSingular = props.component?.subcomponents.length === 1;
  if ((props.component?.subcomponents ?? []) !== previousValue && (props.component?.subcomponents ?? []) !== subcomponents) {
    setSubcomponents(props.component?.subcomponents ?? []);
    previousValueRef.current = props.component?.subcomponents ?? [];
  }
  return (
    <Modal isOpen={props.showing} onClose={props.onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Updating results for {props.component?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isSingular && (
            <div className="mb-4">
              Total weight for {props.component?.name} is {props.component?.subjectWeighting!! * 100}%.
              <br />
              Each {props.component?.nameOfSubcomponentSingular.toLowerCase()} is worth{" "}
              {(
                (props.component?.subjectWeighting!! /
                  (props.component?.subcomponents.length!! - props.component?.numberOfSubComponentsToDrop_Lowest!!)) *
                100
              ).toPrecision(3)}
              %. <br />
              {props.component?.numberOfSubComponentsToDrop_Lowest!! > 0 ? (
                <>The lowest {props.component?.numberOfSubComponentsToDrop_Lowest ?? ""} are being dropped.</>
              ) : (
                <></>
              )}
            </div>
          )}
          <TableContainer>
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Score</Th>
                  <Th>Grade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {subcomponents
                  ?.sort((d, b) => d.numberInSequence - b.numberInSequence)
                  .map((e, i) => {
                    return (
                      <Tr key={e.id}>
                        <Td className="p-2" style={{ minWidth: "200px" }}>
                          <span style={{ fontWeight: "bold" }}>
                            {props.component?.nameOfSubcomponentSingular} {!isSingular && e.numberInSequence}
                          </span>
                        </Td>
                        <Td>
                          <Input
                            type="number"
                            id="courseCodeName"
                            size={"sm"}
                            defaultValue={e.isCompleted ? e.gradeValuePercentage * 100 : ""}
                            onChange={(newGradeResult) => {
                              if (!newGradeResult.target.value) {
                                setSubcomponents(
                                  subcomponents.map((comp) => {
                                    if (comp.id === e.id)
                                      return {
                                        ...comp,
                                        gradeValuePercentage: 0,
                                        isCompleted: false,
                                      };
                                    return comp;
                                  })
                                );
                              } else {
                                var newgradepct = Number.parseFloat(newGradeResult.target.value) / 100;
                                setSubcomponents(
                                  subcomponents.map((comp) => {
                                    if (comp.id === e.id)
                                      return {
                                        ...comp,
                                        gradeValuePercentage: newgradepct,
                                        isCompleted: true,
                                      };
                                    return comp;
                                  })
                                );
                              }
                            }}
                            required={true}
                          />
                          %
                        </Td>
                        <Td className="text-center" style={{ color: "", minWidth: "150px" }}>
                          {e.isCompleted ? (
                            <>
                              {isActiveSubcomponent(props.component!!, e, subcomponents) ? (
                                calculateLetterGrade(e.gradeValuePercentage, props.gradeMap)
                              ) : (
                                <Box className="flex flex-col">
                                  <span>{calculateLetterGrade(e.gradeValuePercentage, props.gradeMap)}</span>
                                  <Text color="gray.500" fontSize="xs" fontWeight={"semibold"}>
                                    Dropped
                                  </Text>
                                </Box>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={loading}
            colorScheme="teal"
            onClick={async () => {
              setLoading(true);
              const updatedComponent = await (
                await fetch(`/api/block/${props.blockId}/course/${props.component?.subjectId}/component/${props.component?.id}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...props.component,
                    subcomponents: subcomponents,
                  }),
                })
              ).json();
              props.onReceiveUpdatedData(updatedComponent);
              userContext.updateCourse(props.component?.subjectId, {
                ...props.subject,
                components: props?.subject.components.map((f) => {
                  if (f.id === updatedComponent.id) return updatedComponent;
                  return f;
                }),
              });
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ComponentEditModal;
