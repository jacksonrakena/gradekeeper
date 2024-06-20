import { EditIcon } from "@chakra-ui/icons";
import { Box, Flex, Td, Text, Tooltip, Tr } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import Decimal from "decimal.js";
import { useAtomValue } from "jotai";
import { ProcessedCourse, ProcessedCourseComponent, calculateLetterGrade } from "../../../../../lib/logic/processing";
import { CourseComponent } from "../../../../../lib/logic/types";
import { routes, useApi } from "../../../../../lib/net/fetch";
import { ProcessedUserState, useInvalidator } from "../../../../../lib/state/course";
import { Editable } from "../../../../generic/Editable";

export const ComponentRow = ({
  component,
  course,
  onEditSubcomponents,
}: {
  component: ProcessedCourseComponent;
  course: ProcessedCourse;
  onEditSubcomponents: () => void;
}) => {
  const user = useAtomValue(ProcessedUserState);
  const { updateComponent } = useInvalidator();
  const fetcher = useApi();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: component.id });

  return (
    <Tr
      key={component.id}
      ref={setNodeRef}
      style={{
        position: "relative",
        transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
        transition: transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 1 : 0,
      }}
      {...attributes}
      {...listeners}
    >
      <Td pl={0} data-no-dnd={true}>
        <Flex alignItems="center">
          <Editable
            data-no-dnd={true}
            onSubmit={async (newName) => {
              const data = await fetcher.post<CourseComponent>(
                routes.block(course.studyBlockId).course(course.id).component(component.id).update(),
                {
                  name: newName,
                }
              );
              if (data) {
                updateComponent(course.id, component.id, (d) => data);
              }
            }}
            backingValue={component.name}
          />
          <Text ml={1}>{component.subcomponents?.length > 1 ? <span>({component.subcomponents.length})</span> : ""}</Text>
        </Flex>
      </Td>
      <Td pl={0} className="text-center" data-no-dnd={true}>
        <Editable
          onSubmit={async (newWeighting) => {
            if (!newWeighting) return;

            const data = await fetcher.post<CourseComponent>(
              routes.block(course.studyBlockId).course(course.id).component(component.id).update(),
              {
                subjectWeighting: new Decimal(newWeighting).div(100),
              }
            );
            if (data) {
              updateComponent(course.id, component.id, (d) => data);
            }
          }}
          backingValue={component.subjectWeighting.mul(100).toString()}
          formatter={(v) => `${v}%`}
        />
      </Td>
      <Td
        pl={0}
        color={"brand"}
        className={component.grades.projected.isAverage ? "flex flex-col text-center font-semibold" : "text-center font-semibold"}
        data-no-dnd={true}
      >
        {component.subcomponents?.length === 1 ? (
          <Tooltip label="Click to edit">
            <Editable
              onSubmit={async (e) => {
                const data = await fetcher.post<CourseComponent>(
                  routes.block(course.studyBlockId).course(course.id).component(component.id).update(),
                  {
                    subcomponents: [
                      {
                        ...component.subcomponents[0],
                        gradeValuePercentage: !!e ? new Decimal(e).div(100) : 0,
                        isCompleted: !!e,
                      },
                    ],
                  }
                );
                if (data) updateComponent(course.id, component.id, () => data);
              }}
              backingValue={component.subcomponents[0]?.isCompleted ? component.grades.projected.value.mul(100).toString() : "0"}
              formatter={(v) => `${v}%`}
            />
          </Tooltip>
        ) : (
          <>
            {" "}
            {!component.grades.projected.isUnknown ? (
              <>
                <Box
                  data-no-dnd={true}
                  cursor="pointer"
                  className="flex"
                  flexDirection={"column"}
                  onClick={() => {
                    onEditSubcomponents();
                  }}
                >
                  <Flex direction={"column"}>
                    <Flex alignItems={"center"}>
                      <EditIcon mr={2} /> {component.grades.projected.value.mul(100).toFixed(2)}%
                    </Flex>
                    {component.grades.projected.isAverage ? <span className="text-xs text-gray-600">Average</span> : ""}
                  </Flex>
                </Box>
              </>
            ) : (
              <Box
                data-no-dnd={true}
                cursor="pointer"
                className="flex"
                flexDirection={"column"}
                onClick={() => {
                  onEditSubcomponents();
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
        {!component.grades.projected.isUnknown && calculateLetterGrade(component.grades.projected.value, user?.gradeMap)}
      </Td>
    </Tr>
  );
};
