import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router";
import { ProcessedCourseInfo, ProcessedStudyBlock } from "../../../../lib/logic/processing";
import { ProcessedUserState } from "../../../lib/state/course";

const CourseSwitcher = (props: { currentCourse: ProcessedCourseInfo; currentStudyBlock: ProcessedStudyBlock }) => {
  const allStudyBlocks = useAtomValue(ProcessedUserState)?.studyBlocks;
  const navigate = useNavigate();

  const user = useAtomValue(ProcessedUserState);
  const subjects = user?.studyBlocks?.filter((e) => Date.now() < new Date(e.endDate).getTime()).flatMap((d) => d.courses);
  const blockMap = subjects?.reduce((block: { [x: string]: any }, course) => {
    block[course.studyBlockId] = block[course.studyBlockId] ?? [];
    block[course.studyBlockId].push(course);
    return block;
  }, {});

  return (
    <Menu isLazy={true}>
      <MenuButton colorScheme={"brand"} as={Button} rightIcon={<ChevronDownIcon />}>
        {props.currentCourse?.courseCodeName} {props.currentCourse?.courseCodeNumber}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            navigate("/");
          }}
        >
          <Text fontWeight="semibold">Dashboard</Text>
        </MenuItem>
        <MenuDivider />
        {Object.keys(blockMap as any)
          .filter((blockName) => blockMap[blockName].filter((gg: any) => gg.id !== props.currentCourse?.id).length !== 0)
          .map((block) => (
            <MenuGroup key={block} title={allStudyBlocks?.filter((d) => d.id === block)[0].name}>
              {props.currentStudyBlock?.courses
                ?.filter((e) => e.id !== props.currentCourse?.id && e.studyBlockId === block)
                .map((d) => (
                  <MenuItem
                    onClick={() => {
                      navigate(`/blocks/${d.studyBlockId}/courses/${d.id}`);
                    }}
                    key={d.id}
                  >
                    <Text fontWeight={"semibold"} color={d.color}>
                      {d.courseCodeName} {d.courseCodeNumber}: {d.longName}
                    </Text>
                  </MenuItem>
                ))}
            </MenuGroup>
          ))}
      </MenuList>
    </Menu>
  );
};

export default CourseSwitcher;
