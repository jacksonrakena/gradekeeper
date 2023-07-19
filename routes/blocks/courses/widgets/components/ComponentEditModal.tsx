import { Button } from "@chakra-ui/button";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Box, Input, Text } from "@chakra-ui/react";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import Decimal from "decimal.js";
import { useState } from "react";
import { calculateLetterGrade, GradeMap, isActiveSubcomponent, ProcessedCourseComponent } from "../../../../../src/lib/logic/processing";
import { useInvalidator } from "../../../../../src/lib/state/course";

const ComponentEditModal = (props: {
  gradeMap: GradeMap;
  showing: boolean;
  component: ProcessedCourseComponent;
  courseId: string;
  blockId: string;
  onClose: () => void;
}) => {
  const { updateComponent } = useInvalidator();
  const [subcomponents, setSubcomponents] = useState(props.component.subcomponents);
  const [loading, setLoading] = useState(false);

  const isSingular = props.component?.subcomponents.length === 1;

  return (
    <Modal isOpen={props.showing} onClose={props.onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Updating results for {props.component?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isSingular && (
            <Box className="mb-4">
              Total weight for {props.component.name} is {props.component.subjectWeighting.mul(100).toString()}%.
              <br />
              Each {props.component?.nameOfSubcomponentSingular.toLowerCase()} is worth{" "}
              {props.component.subjectWeighting
                .div(props.component.subcomponents.length - props.component?.numberOfSubComponentsToDrop_Lowest)
                .mul(100)
                .toPrecision(2)}
              %. <br />
              {props.component?.numberOfSubComponentsToDrop_Lowest!! > 0 ? (
                <>The lowest {props.component?.numberOfSubComponentsToDrop_Lowest ?? ""} are being dropped.</>
              ) : (
                <></>
              )}
            </Box>
          )}
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Score</Th>
                  <Th>Grade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {subcomponents
                  ?.map((e) => e)
                  .sort((d, b) => (d.numberInSequence ?? 0) - (b.numberInSequence ?? 0))
                  .map((e, i) => {
                    return (
                      <Tr key={e.id}>
                        <Td className="p-2">
                          <span style={{ fontWeight: "bold" }}>{e.numberInSequence}</span>
                        </Td>
                        <Td>
                          <Input
                            type="number"
                            id="courseCodeName"
                            size={"sm"}
                            defaultValue={e.isCompleted ? e.gradeValuePercentage.mul(100).toString() : ""}
                            onChange={(newGradeResult) => {
                              if (!newGradeResult.target.value) {
                                setSubcomponents(
                                  subcomponents.map((comp) => {
                                    if (comp.id === e.id)
                                      return {
                                        ...comp,
                                        gradeValuePercentage: new Decimal(0),
                                        isCompleted: false,
                                      };
                                    return comp;
                                  })
                                );
                              } else {
                                setSubcomponents(
                                  subcomponents.map((comp) => {
                                    if (comp.id === e.id)
                                      return {
                                        ...comp,
                                        gradeValuePercentage: new Decimal(newGradeResult.target.value).div(100),
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
            colorScheme="brand"
            onClick={async () => {
              setLoading(true);
              const updatedComponent = await (
                await fetch(`/api/block/${props.blockId}/course/${props.courseId}/component/${props.component?.id}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...props.component,
                    subcomponents: subcomponents,
                  }),
                })
              ).json();
              props.onClose();
              updateComponent(props.courseId, props.component.id, () => updatedComponent);
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
