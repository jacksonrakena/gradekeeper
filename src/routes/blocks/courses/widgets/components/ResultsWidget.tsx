import { CourseComponent } from "@/lib/logic/types";
import { routes, useApi } from "@/lib/net/fetch";
import { useInvalidator } from "@/lib/state/course";
import { Box, Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { DndContext, DragEndEvent, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { ProcessedCourse, ProcessedCourseComponent } from "../../../../../lib/logic/processing";
import ComponentRow, { VMouseSensor, VTouchSensor } from "./ComponentRow";
import SubcomponentEditor from "./SubcomponentEditor";

export const ResultsWidget = (props: { course: ProcessedCourse; contrastingColor: string }) => {
  const [targetComponent, setTargetComponent] = useState<ProcessedCourseComponent | null>(null);

  const fetcher = useApi();
  const [comp, setComp] = useState(props.course.components.toSorted((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0)));

  const { updateComponent } = useInvalidator();
  const sensors = useSensors(useSensor(VMouseSensor), useSensor(VTouchSensor));
  useEffect(() => {
    setComp(props.course.components.toSorted((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0)));
  }, [props.course.components]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      (async () => {
        console.log(`Attempt move from ${active.id} to ${over.id}`);
        const first = props.course.components.filter((e) => e.id === active.id)[0];
        const second = props.course.components.filter((e) => e.id === over.id)[0];
        if (!first || !second) {
          console.log("Move failed");
          return;
        }
        const oldSeqNo = first.sequenceNumber;
        const newSeqNo = second.sequenceNumber;

        const fi = comp.indexOf(first);
        const si = comp.indexOf(second);
        setComp(arrayMove(comp, fi, si));

        const reset = () => {
          setComp(props.course.components.toSorted((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0)));
        };
        console.log(`setting ${first.id} to ${newSeqNo}, ${second.id} to ${oldSeqNo}`);
        const data0 = await fetcher.post<CourseComponent>(
          routes.block(props.course.studyBlockId).course(props.course.id).component(first.id).update(),
          {
            sequenceNumber: newSeqNo,
          }
        );
        if (data0) {
          updateComponent(data0.courseId, data0.id, (d) => data0);
        } else reset();

        const data1 = await fetcher.post<CourseComponent>(
          routes.block(props.course.studyBlockId).course(props.course.id).component(second.id).update(),
          {
            sequenceNumber: oldSeqNo,
          }
        );
        if (data1) {
          updateComponent(data1.courseId, data1.id, (d) => data1);
        } else reset();
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
          showing={!!targetComponent}
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext items={comp.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  {comp.map((e, i) => (
                    <ComponentRow
                      onEditSubcomponents={() => {
                        setTargetComponent(e);
                      }}
                      course={props.course}
                      key={e.id}
                      component={e}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};
