import { Box, Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { ProcessedCourse, ProcessedCourseComponent } from "../../../../../src/lib/logic/processing";
import ComponentEditModal from "./ComponentEditModal";
import ComponentRow from "./ComponentRow";

export const ResultsWidget = (props: { course: ProcessedCourse; contrastingColor: string }) => {
  const [targetComponent, setTargetComponent] = useState<ProcessedCourseComponent | null>(null);
  return (
    <>
      {targetComponent && (
        <ComponentEditModal
          gradeMap={props.course.status.gradeMap}
          onClose={() => {
            setTargetComponent(null);
          }}
          showing={targetComponent !== null}
          component={targetComponent}
          blockId={props.course.studyBlockId}
          courseId={props.course.id}
        />
      )}
      <div className="grow m-4 p-6 shadow-md rounded-md overflow-auto" style={{ backgroundColor: props.contrastingColor }}>
        <Box className="text-2xl mb-2 font-bold">Results</Box>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th pl={0}>Name</Th>
                <Th pl={0}>Weight</Th>
                <Th pl={0}>Score</Th>
                <Th pl={0}>Grade</Th>
              </Tr>
            </Thead>
            <Tbody>
              {props.course.components?.map((e, i) => (
                <ComponentRow
                  onRequestModalOpen={() => {
                    setTargetComponent(e);
                  }}
                  course={props.course}
                  key={e.id}
                  component={e}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};
