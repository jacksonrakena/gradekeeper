import { RespectfulMouseSensor, RespectfulTouchSensor } from "@/components/generic/dnd-kit/sensors";
import { ProcessedCourse, ProcessedCourseComponent } from "@/lib/logic/processing";
import { Course } from "@/lib/logic/types";
import { routes, useApi } from "@/lib/net/fetch";
import { useInvalidator } from "@/lib/state/course";
import { Table, TableContainer, Tbody, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { DndContext, DragEndEvent, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { ComponentRow } from "./ComponentRow";
import { SubcomponentEditor } from "./SubcomponentEditor";

export const ResultsWidget = (props: { course: ProcessedCourse }) => {
  const [targetComponent, setTargetComponent] = useState<ProcessedCourseComponent | null>(null);

  const fetcher = useApi();
  const [comp, setComp] = useState(props.course.components.toSorted((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0)));

  const { updateCourse } = useInvalidator();
  const sensors = useSensors(useSensor(RespectfulTouchSensor), useSensor(RespectfulMouseSensor));
  useEffect(() => {
    setComp(props.course.components.toSorted((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0)));
  }, [props.course.components]);

  const tryUpdateSequenceOrder = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      (async () => {
        const first = props.course.components.filter((e) => e.id === active.id)[0];
        const second = props.course.components.filter((e) => e.id === over.id)[0];

        const fi = comp.indexOf(first);
        const si = comp.indexOf(second);
        const resultant = arrayMove(comp, fi, si);
        setComp(resultant);
        const reset = () => {
          setComp(props.course.components.toSorted((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0)));
        };
        const courseResult = await fetcher.post<Course>(
          routes.block(props.course.studyBlockId).course(props.course.id).order().update(),
          resultant.reduce((acc: any, cur, i) => {
            acc[cur.id] = i + 1;
            return acc;
          }, {})
        );
        if (courseResult) updateCourse(props.course.id, (e) => courseResult);
        else reset();
      })();
    }
  };
  return (
    <>
      {targetComponent && (
        <SubcomponentEditor
          gradeMap={props.course.status.gradeMap}
          onClose={() => {
            setTargetComponent(null);
          }}
          component={targetComponent}
          blockId={props.course.studyBlockId}
          courseId={props.course.id}
        />
      )}
      <Text mb={2} fontWeight={"bold"} className="text-2xl">
        Results
      </Text>

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={tryUpdateSequenceOrder}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext items={comp.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                {comp.map((component) => (
                  <ComponentRow
                    onEditSubcomponents={() => {
                      setTargetComponent(component);
                    }}
                    course={props.course}
                    key={component.id}
                    component={component}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
