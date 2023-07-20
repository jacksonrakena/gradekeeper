import { EditIcon } from "@chakra-ui/icons";
import { Box, Flex, Td, Text, Tooltip, Tr } from "@chakra-ui/react";
import Decimal from "decimal.js";
import { useRecoilValue } from "recoil";
import { Editable } from "../../../../../components/generic/Editable";
import { calculateLetterGrade, ProcessedCourse, ProcessedCourseComponent } from "../../../../../lib/logic/processing";
import { SubjectComponent } from "../../../../../lib/logic/types";
import { routes, useApi } from "../../../../../lib/net/fetch";
import { ProcessedUserState, useInvalidator } from "../../../../../lib/state/course";

const ComponentRow = (props: { component: ProcessedCourseComponent; course: ProcessedCourse; onEditSubcomponents: () => void }) => {
  const user = useRecoilValue(ProcessedUserState);
  const { updateComponent } = useInvalidator();
  const e = props.component;
  const subject = props.course;
  const grade = props.component.grades.projected;
  const fetcher = useApi();
  return (
    <Tr key={e.name}>
      <Td pl={0}>
        <Flex alignItems="center">
          <Editable
            onSubmit={async (newName) => {
              const data = await fetcher.post<SubjectComponent>(
                routes.block(subject.studyBlockId).course(subject.id).component(e.id).update(),
                {
                  name: newName,
                }
              );
              if (data) {
                updateComponent(subject.id, e.id, (d) => data);
              }
            }}
            initialValue={e.name}
          />
          <Text ml={1}>{e.subcomponents?.length > 1 ? <span>({e.subcomponents.length})</span> : ""}</Text>
        </Flex>
      </Td>
      <Td pl={0} className="text-center">
        <Editable
          onSubmit={async (newWeighting) => {
            if (!newWeighting) return;

            const data = await fetcher.post<SubjectComponent>(
              routes.block(subject.studyBlockId).course(subject.id).component(e.id).update(),
              {
                subjectWeighting: new Decimal(newWeighting).div(100),
              }
            );
            if (data) {
              updateComponent(subject.id, e.id, (d) => data);
            }
          }}
          initialValue={e.subjectWeighting.mul(100).toString()}
          formatter={(v) => `${v}%`}
        />
      </Td>
      <Td pl={0} color={"brand"} className={grade.isAverage ? "flex flex-col text-center font-semibold" : "text-center font-semibold"}>
        {e.subcomponents?.length === 1 ? (
          <Tooltip label="Click to edit">
            <Editable
              onSubmit={async (e) => {
                const data = await fetcher.post<SubjectComponent>(
                  routes.block(subject.studyBlockId).course(subject.id).component(props.component.id).update(),
                  {
                    subcomponents: [
                      {
                        ...props.component.subcomponents[0],
                        gradeValuePercentage: !!e ? new Decimal(e).div(100) : 0,
                        isCompleted: !!e,
                      },
                    ],
                  }
                );
                if (data) updateComponent(props.course.id, props.component.id, () => data);
              }}
              initialValue={props.component.subcomponents[0]?.isCompleted ? grade.value.mul(100).toString() : "0"}
              formatter={(v) => `${v}%`}
            />
          </Tooltip>
        ) : (
          <>
            {" "}
            {!grade.isUnknown ? (
              <>
                <Box
                  cursor="pointer"
                  className="flex"
                  flexDirection={"column"}
                  onClick={() => {
                    props.onEditSubcomponents();
                  }}
                >
                  <Flex direction={"column"}>
                    <Flex alignItems={"center"}>
                      <EditIcon mr={2} /> {grade.value.mul(100).toFixed(2)}%
                    </Flex>
                    {grade.isAverage ? <span className="text-xs text-gray-600">Average</span> : ""}
                  </Flex>
                </Box>
              </>
            ) : (
              <Box
                cursor="pointer"
                className="flex"
                flexDirection={"column"}
                onClick={() => {
                  props.onEditSubcomponents();
                }}
              >
                <Flex direction={"column"}>
                  <Flex alignItems={"center"}>
                    <EditIcon mr={2} /> 0%
                  </Flex>
                </Flex>
              </Box>
            )}
          </>
        )}
      </Td>
      <Td pl={0} fontWeight={"semibold"} className="text-center">
        {!grade.isUnknown && calculateLetterGrade(grade.value, user?.gradeMap)}
      </Td>
    </Tr>
  );
};
export default ComponentRow;
