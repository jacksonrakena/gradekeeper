import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  IconButton,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { mutate } from "swr";
import { _null } from "../../../lib/logic";
import { getUserQuery } from "../../../pages/api/user";
import { useUserContext } from "../../../pages/UserContext";
import { TopBar } from "../../TopBar";
import CoursePill from "./CoursePill";

const CourseList = () => {
  const { user } = useUserContext();
  const isLoading = !user;
  const cancelRef = useRef<any>();
  const [deleteStudyBlock, setDeleteStudyBlock] = useState(_null<any>());
  const toast = useToast();
  const router = useRouter();
  const [isDeletingStudyBlock, setIsDeletingSb] = useState(false);
  return (
    <div className="mb-12">
      <TopBar />
      <>
        <Head>
          <title>My courses</title>
        </Head>
        <AlertDialog
          isOpen={deleteStudyBlock !== null}
          leastDestructiveRef={cancelRef}
          onClose={() => {
            setDeleteStudyBlock(null);
          }}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete block &lsquo;{deleteStudyBlock?.name}&rsquo;
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you <strong>sure</strong> you want to delete {deleteStudyBlock?.name}? <br />
                This will delete <strong>{deleteStudyBlock?.subjects.length}</strong> courses.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    setDeleteStudyBlock(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setIsDeletingSb(true);
                    mutate("/api/user", async (user: Prisma.UserGetPayload<typeof getUserQuery>) => {
                      await fetch(`/api/block/${deleteStudyBlock?.id ?? ""}`, { method: "DELETE" });
                      toast({
                        title: "Study block deleted.",
                        description: deleteStudyBlock?.name + " deleted.",
                        duration: 4000,
                        isClosable: true,
                        status: "success",
                      });
                      setIsDeletingSb(false);
                      setDeleteStudyBlock(null);
                      return { ...user, studyBlocks: user.studyBlocks.filter((e) => e.id !== deleteStudyBlock?.id ?? "") };
                    });
                  }}
                  isLoading={isDeletingStudyBlock}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <div>
          <div className={"flex flex-col px-12"}>
            <Skeleton isLoaded={(user && !isLoading) ?? false}>
              {user?.studyBlocks?.map((studyBlock) => {
                const sbStart = new Date(studyBlock.startDate);
                const sbEnd = new Date(studyBlock.endDate);
                const dtf = new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
                return (
                  <div key={studyBlock.id} className="mb-12">
                    <div className="flex">
                      <Heading size="lg">
                        {studyBlock.name}
                        <IconButton
                          onClick={() => {
                            setDeleteStudyBlock(studyBlock);
                          }}
                          className="ml-4"
                          icon={<DeleteIcon />}
                          size="xs"
                          aria-label={"Delete"}
                          colorScheme="teal"
                        />
                      </Heading>
                    </div>
                    <div className="text-md">
                      {dtf.format(sbStart)} &#8212; {dtf.format(sbEnd)}
                    </div>

                    {studyBlock.subjects.map((subject) => (
                      <CoursePill
                        key={subject.id}
                        onClick={() => {
                          router.push(`/blocks/${studyBlock.id}/courses/${subject.id}`);
                        }}
                        subject={subject}
                        gradeMap={user.gradeMap}
                      />
                    ))}

                    <Link key={"new-" + studyBlock.id} href={"/blocks/" + studyBlock.id + "/courses/create"}>
                      <Button colorScheme="teal" size="sm">
                        + New course in {studyBlock.name}
                      </Button>
                    </Link>
                  </div>
                );
              })}
              <Link key={"new-block"} href={"/blocks/create"}>
                <Button colorScheme="orange" size="sm">
                  + New trimester/semester
                </Button>
              </Link>
            </Skeleton>
          </div>
        </div>
      </>
    </div>
  );
};

export default CourseList;
