import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { Subject } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { ProcessedUserState, SelectedCourseState, SelectedStudyBlockState } from "../../../lib/state/course";

const CourseSwitcher = ({ blockMap }: { blockMap: any }) => {
  const currentCourse = useRecoilValue(SelectedCourseState);
  const currentStudyBlock = useRecoilValue(SelectedStudyBlockState);
  const allStudyBlocks = useRecoilValue(ProcessedUserState)?.processedStudyBlocks;
  const router = useRouter();
  return (
    <Menu isLazy={true}>
      <MenuButton colorScheme={"brand"} as={Button} rightIcon={<ChevronDownIcon />}>
        {currentCourse?.courseCodeName} {currentCourse?.courseCodeNumber}
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => {
            router.push("/");
          }}
        >
          <Text fontWeight="semibold">Dashboard</Text>
        </MenuItem>
        <MenuDivider />
        {Object.keys(blockMap as any)
          .filter((blockName) => blockMap[blockName].filter((gg: any) => gg.id !== currentCourse?.id).length !== 0)
          .map((block) => (
            <MenuGroup key={block} title={allStudyBlocks?.filter((d) => d.id === block)[0].name}>
              {currentStudyBlock?.processedCourses
                ?.filter((e) => e.id !== currentCourse?.id && e.studyBlockId === block)
                .map((d: Subject) => (
                  <MenuItem
                    onClick={() => {
                      router.push(`/blocks/${d.studyBlockId}/courses/${d.id}`);
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
