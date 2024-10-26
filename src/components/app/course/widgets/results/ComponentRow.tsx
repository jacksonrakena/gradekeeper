import { isPossibleDecimal } from "@/lib/util";
import { EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, IconButton, Td, Text, Tooltip, Tr, useDisclosure } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import Decimal from "decimal.js";
import { evaluate } from "mathjs";
import { ProcessedCourse, ProcessedCourseComponent } from "../../../../../lib/logic/processing";
import { CourseComponent } from "../../../../../lib/logic/types";
import { routes, useApi } from "../../../../../lib/net/fetch";
import { useInvalidator } from "../../../../../lib/state/course";
import { Editable } from "../../../../generic/Editable";
import { ResultShareModal } from "./ResultShareModal";

export const ComponentRow = ({
  component,
  course,
  onEditSubcomponents,
}: {
  component: ProcessedCourseComponent;
  course: ProcessedCourse;
  onEditSubcomponents: () => void;
}) => {
  const { updateComponent } = useInvalidator();
  const fetcher = useApi();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: component.id });
  const shareModalDisclosure = useDisclosure();
  return (
    <>
      <ResultShareModal course={course} component={component} disclosure={shareModalDisclosure} />
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
                return !!data;
              }}
              backingValue={component.name}
            />
            <Text ml={1}>{component.subcomponents?.length > 1 ? <span>({component.subcomponents.length})</span> : ""}</Text>
          </Flex>
        </Td>
        <Td pl={0} className="text-center" data-no-dnd={true}>
          <Editable
            onSubmit={async (newWeighting) => {
              if (!newWeighting) return false;

              const data = await fetcher.post<CourseComponent>(
                routes.block(course.studyBlockId).course(course.id).component(component.id).update(),
                {
                  subjectWeighting: new Decimal(newWeighting).div(100),
                }
              );
              if (data) {
                updateComponent(course.id, component.id, (d) => data);
              }
              return !!data;
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
                  let value = new Decimal(0);
                  if (!!e) {
                    if (isPossibleDecimal(e)) {
                      value = new Decimal(e).div(100);
                    } else {
                      value = new Decimal(evaluate(e));
                      console.log(value.toString());
                    }
                  }
                  const data = await fetcher.post<CourseComponent>(
                    routes.block(course.studyBlockId).course(course.id).component(component.id).update(),
                    {
                      subcomponents: [
                        {
                          ...component.subcomponents[0],
                          gradeValuePercentage: value,
                          isCompleted: !!e,
                        },
                      ],
                    }
                  );
                  if (data) updateComponent(course.id, component.id, () => data);
                  return !!data;
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
        <Td data-no-dnd={true} pl={0} fontWeight={"semibold"} className="text-center">
          <HStack>
            <Box>{!component.grades.projected.isUnknown && component.grades.projected.letter}</Box>
            {!component.grades.actual.isUnknown && (
              <IconButton onClick={shareModalDisclosure.onOpen} aria-label="Share" icon={<ExternalLinkIcon />} size="sm" />
            )}
          </HStack>
        </Td>
      </Tr>
    </>
  );
};
