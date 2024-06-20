import { EditIcon } from "@chakra-ui/icons";
import { Box, Flex, Td, Text, Tooltip, Tr } from "@chakra-ui/react";
import { MouseSensor as LibMouseSensor, TouchSensor } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import Decimal from "decimal.js";
import { useAtomValue } from "jotai";
import type { MouseEvent, TouchEvent } from "react";
import { Editable } from "../../../../../components/generic/Editable";
import { ProcessedCourse, ProcessedCourseComponent, calculateLetterGrade } from "../../../../../lib/logic/processing";
import { CourseComponent } from "../../../../../lib/logic/types";
import { routes, useApi } from "../../../../../lib/net/fetch";
import { ProcessedUserState, useInvalidator } from "../../../../../lib/state/course";
export class VMouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

export class VTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: "onTouchStart" as const,
      handler: ({ nativeEvent: event }: TouchEvent<Element>) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

function shouldHandleEvent(element: HTMLElement | null) {
  let cur = element;

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}

const ComponentRow = (props: { component: ProcessedCourseComponent; course: ProcessedCourse; onEditSubcomponents: () => void }) => {
  const user = useAtomValue(ProcessedUserState);
  const { updateComponent } = useInvalidator();
  const e = props.component;
  const subject = props.course;
  const grade = props.component.grades.projected;
  const fetcher = useApi();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.component.id });

  return (
    <Tr
      key={e.id}
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
                routes.block(subject.studyBlockId).course(subject.id).component(e.id).update(),
                {
                  name: newName,
                }
              );
              if (data) {
                updateComponent(subject.id, e.id, (d) => data);
              }
            }}
            backingValue={e.name}
          />
          <Text ml={1}>{e.subcomponents?.length > 1 ? <span>({e.subcomponents.length})</span> : ""}</Text>
        </Flex>
      </Td>
      <Td pl={0} className="text-center" data-no-dnd={true}>
        <Editable
          onSubmit={async (newWeighting) => {
            if (!newWeighting) return;

            const data = await fetcher.post<CourseComponent>(
              routes.block(subject.studyBlockId).course(subject.id).component(e.id).update(),
              {
                subjectWeighting: new Decimal(newWeighting).div(100),
              }
            );
            if (data) {
              updateComponent(subject.id, e.id, (d) => data);
            }
          }}
          backingValue={e.subjectWeighting.mul(100).toString()}
          formatter={(v) => `${v}%`}
        />
      </Td>
      <Td
        pl={0}
        color={"brand"}
        className={grade.isAverage ? "flex flex-col text-center font-semibold" : "text-center font-semibold"}
        data-no-dnd={true}
      >
        {e.subcomponents?.length === 1 ? (
          <Tooltip label="Click to edit">
            <Editable
              onSubmit={async (e) => {
                const data = await fetcher.post<CourseComponent>(
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
              backingValue={props.component.subcomponents[0]?.isCompleted ? grade.value.mul(100).toString() : "0"}
              formatter={(v) => `${v}%`}
            />
          </Tooltip>
        ) : (
          <>
            {" "}
            {!grade.isUnknown ? (
              <>
                <Box
                  data-no-dnd={true}
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
                data-no-dnd={true}
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
