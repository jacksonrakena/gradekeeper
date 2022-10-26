import { Box, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from "@chakra-ui/react";
import { ProcessedCourseInfo } from "../../../../lib/logic/processing";
import themeConstants from "../../../../lib/theme/themeConstants";

const AveragesWidget = (props: { course: ProcessedCourseInfo }) => {
  const actual = props.course.grades.actual;
  const unachievedGrades: number[] =
    props.course.status.gradeMap &&
    Object.keys(props.course.status.gradeMap)
      .map(Number.parseFloat)
      .filter((d) => actual?.numerical < d && d <= 100);

  const remainingComponents = props.course?.status.componentsRemaining;
  const remainingPieces = remainingComponents
    ?.map((d) =>
      d.subcomponents
        .filter((e) => !e.isCompleted)
        .map((e) => d.subjectWeighting / (d.subcomponents.length - d.numberOfSubComponentsToDrop_Lowest))
    )
    .flat();
  return (
    <Box
      className="grow m-4 p-6 shadow-md rounded-md"
      style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
    >
      <Box className="text-2xl mb-2 font-bold">Averages</Box>
      <div>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>To get a...</Th>
                <Th>You need an average of </Th>
              </Tr>
            </Thead>
            <Tbody>
              {unachievedGrades
                ?.sort((a, b) => b - a)
                .filter((e) => ((e - actual.numerical) / remainingPieces.reduce((a, b) => a + b)) * 100 <= 100)
                .map((e) => (
                  <Tr key={e}>
                    <Td>
                      <Box>
                        <Text fontWeight="semibold">{props.course.status.gradeMap[e]}</Text>
                      </Box>
                    </Td>
                    <Td>
                      <Flex direction={"row"}>
                        <Text color={"brand"} fontWeight="semibold">
                          {(((e - actual.numerical) / remainingPieces.reduce((a, b) => a + b)) * 100).toFixed(1)}
                        </Text>
                        %
                      </Flex>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default AveragesWidget;
