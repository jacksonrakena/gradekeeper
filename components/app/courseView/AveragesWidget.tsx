import { Box, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from "@chakra-ui/react";
import { FullSubject } from "../../../lib/fullEntities";
import { ProcessedCourseData } from "../../../lib/logic";
import themeConstants from "../../../lib/theme/themeConstants";

const AveragesWidget = (props: { course: FullSubject; processed: ProcessedCourseData; gradeMap: object }) => {
  const actual = props.processed?.grades?.actual;
  const unachievedGrades =
    props.gradeMap &&
    Object.keys(props.gradeMap)
      .map(Number.parseFloat)
      .filter((d) => actual?.numerical < d);

  const remainingComponents = props.processed?.status.componentsRemaining;
  const remainingPieces = remainingComponents
    ?.map((d) =>
      d.subcomponents
        .filter((e) => !e.isCompleted)
        .map((e) => d.subjectWeighting / (d.subcomponents.length - d.numberOfSubComponentsToDrop_Lowest))
    )
    .flat();
  console.log(remainingPieces);
  return (
    <Box
      className="grow m-4 p-6 shadow-md rounded-md"
      style={{ backgroundColor: useColorModeValue("white", themeConstants.darkModeContrastingColor) }}
    >
      <div style={{ color: props.course?.color }} className="text-2xl mb-2 font-bold">
        Averages
      </div>
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
                .map((e) => (
                  <Tr>
                    <Td>
                      <Box>
                        <Text fontWeight="semibold">{props.gradeMap[e]}</Text>
                      </Box>
                    </Td>
                    <Td>
                      <Flex direction={"row"}>
                        <Text color={props.course.color} fontWeight="semibold">
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
