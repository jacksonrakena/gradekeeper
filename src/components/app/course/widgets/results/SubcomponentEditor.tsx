import { calculateLetterGrade, GradeMap, isActiveSubcomponent, ProcessedCourseComponent } from "@/lib/logic/processing";
import { CourseComponent } from "@/lib/logic/types";
import { routes, useApi } from "@/lib/net/fetch";
import { useInvalidator } from "@/lib/state/course";
import { Button } from "@chakra-ui/button";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { Box, Input, Text } from "@chakra-ui/react";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import Decimal from "decimal.js";
import { useState } from "react";

export const SubcomponentEditor = (props: {
  gradeMap: GradeMap;
  component: ProcessedCourseComponent;
  courseId: string;
  blockId: string;
  onClose: () => void;
}) => {
  const { updateComponent } = useInvalidator();
  const [subcomponents, setSubcomponents] = useState(props.component.subcomponents);
  const [loading, setLoading] = useState(false);
  const fetcher = useApi();

  return (
    <Modal isOpen={true} onClose={props.onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.component.name} ({props.component.subjectWeighting.mul(100).toString()}%)
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box className="mb-4">
            Each individual piece is worth{" "}
            {props.component.subjectWeighting
              .div(props.component.subcomponents.length - props.component.numberOfSubComponentsToDrop_Lowest)
              .mul(100)
              .toPrecision(2)}
            %. <br />
            {props.component.numberOfSubComponentsToDrop_Lowest > 0 && (
              <>The lowest {props.component.numberOfSubComponentsToDrop_Lowest ?? ""} are being dropped.</>
            )}
          </Box>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Score</Th>
                  <Th>Grade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {subcomponents
                  .map((e) => e)
                  .sort((d, b) => d.numberInSequence - b.numberInSequence)
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
                            htmlSize={2}
                            width={"auto"}
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
              const updated = await fetcher.post<CourseComponent>(
                routes.block(props.blockId).course(props.courseId).component(props.component.id).update(),
                {
                  ...props.component,
                  subcomponents: subcomponents,
                }
              );
              if (updated) {
                updateComponent(props.courseId, props.component.id, () => updated);
                props.onClose();
              }
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
