import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  SkeletonText,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Subject } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AiOutlineHome } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { useUserContext } from "../../UserContext";

export const TopBar = (props: { currentSubjectId?: string }) => {
  const sessiondata = useSession();
  const session = sessiondata.data;
  const router = useRouter();
  const user = useUserContext();
  const cm = useColorMode();
  const studyBlocks = user.user?.studyBlocks;
  const subjects = user.user?.studyBlocks?.flatMap((d) => d.subjects);
  const currentSubject = subjects && props.currentSubjectId ? subjects.filter((d) => d.id === props.currentSubjectId)[0] : null;
  const blockMap = subjects?.reduce((block, course) => {
    block[course.studyBlockId] = block[course.studyBlockId] ?? [];
    block[course.studyBlockId].push(course);
    return block;
  }, {});
  return (
    <div>
      <div className="w-full p-2 flex flex-row">
        <div className="grow">
          {subjects && props.currentSubjectId && (
            <Menu isLazy={true}>
              <MenuButton colorScheme={"teal"} as={Button} rightIcon={<ChevronDownIcon />}>
                {currentSubject?.courseCodeName} {currentSubject?.courseCodeNumber}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  <Text fontWeight="semibold">Home</Text>
                </MenuItem>
                <MenuDivider />
                {Object.keys(blockMap)
                  .filter((blockName) => blockMap[blockName].filter((gg) => gg.id !== currentSubject?.id).length !== 0)
                  .map((block) => (
                    <MenuGroup key={block} title={studyBlocks?.filter((d) => d.id === block)[0].name}>
                      {subjects
                        ?.filter((e) => e.id !== props.currentSubjectId && e.studyBlockId === block)
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
          )}
        </div>
        <div>
          <SkeletonText isLoaded={sessiondata.status !== "loading"}>
            {session ? (
              <>
                <Menu>
                  <MenuButton as={Button} colorScheme={"teal"} rightIcon={<ChevronDownIcon />}>
                    <Flex alignItems="center">
                      <Avatar size="sm" name={session.user?.name} src={session.user?.image} mr={2}></Avatar>
                      {session.user?.name}
                    </Flex>
                  </MenuButton>
                  <MenuList overflow={"hidden"}>
                    <MenuItem onClick={() => router.push("/")}>
                      <Flex alignItems={"center"}>
                        <Icon w={4} h={4} as={AiOutlineHome} mr={2} /> Home
                      </Flex>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push("/account");
                      }}
                    >
                      <Flex alignItems={"center"}>
                        <Icon w={4} h={4} as={FiSettings} mr={2} /> Account
                      </Flex>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        signOut({ redirect: false }).then(() => {
                          router.push("/");
                        });
                      }}
                    >
                      <Flex alignItems={"center"}>
                        <Icon w={5} h={5} as={IoIosLogOut} mr={2} />
                        Log out
                      </Flex>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <button onClick={() => signIn()}>Sign in</button>
              </>
            )}
          </SkeletonText>
        </div>
      </div>
    </div>
  );
};
