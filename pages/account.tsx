import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  HStack,
  Link,
  NumberInput,
  NumberInputField,
  Stack,
  Switch,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { TopBar } from "../components/app/TopBar";
import { useUserContext } from "../lib/UserContext";

const predefinedGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-"];
const presets = {
  init: {
    "0.35": "D-",
    "0.4": "D",
    "0.45": "D+",
    "0.5": "C-",
    "0.6": "C+",
    "0.7": "B",
    "0.8": "A-",
    "0.9": "A+",
    "0.55": "C",
    "0.65": "B-",
    "0.75": "B+",
    "0.85": "A",
  },
  "Victoria University of Wellington": {
    "0.4": "D",
    "0.5": "C-",
    "0.6": "C+",
    "0.7": "B",
    "0.8": "A-",
    "0.9": "A+",
    "0.55": "C",
    "0.65": "B-",
    "0.75": "B+",
    "0.85": "A",
  },
};

const GradeBoundaryEntry = (props: { userGradeMap: object; gradeString: string; onChange: (gradeMap: object) => void }) => {
  if (!props.userGradeMap) return <></>;
  const definedGrades = Object.values(props.userGradeMap);
  const uninitDefault = Object.entries(presets["init"]).find(([pct, grade]) => grade === props.gradeString)?.[0] ?? "";
  const value = Object.entries(props.userGradeMap).find(([pct, grade]) => grade === props.gradeString);
  return (
    <Box my={2} mr={6}>
      <HStack>
        <Switch
          onChange={(c) => {
            console.log(c.target.checked);
            var newGradeMap = props.userGradeMap;
            if (c.target.checked) {
              newGradeMap = { ...newGradeMap, [value ? value[0].toString() : uninitDefault]: props.gradeString };
            } else
              newGradeMap = Object.fromEntries(
                Object.entries(newGradeMap).filter((d) => {
                  // @ts-ignore
                  return d[0] !== value[0].toString();
                })
              );
            console.log(newGradeMap);
            props.onChange(newGradeMap);
          }}
          isChecked={definedGrades.includes(props.gradeString)}
        />
        <Text>{props.gradeString}:</Text>
        <NumberInput
          onChange={(c) => {
            var newmap = Object.fromEntries(Object.entries(props.userGradeMap).filter((e) => e[1] !== props.gradeString));
            console.log({ ...newmap, [c]: props.gradeString });
            props.onChange({ ...newmap, [c]: props.gradeString });
          }}
          variant={"filled"}
          value={value ? value[0] : ""}
        >
          <NumberInputField disabled={!value} />
        </NumberInput>
      </HStack>
    </Box>
  );
};

const GradeMapEditor = (props: { gradeMap: object }) => {
  const user = useUserContext();
  const toast = useToast();
  const [gradeMap, setGradeMap] = useState(props.gradeMap);
  const [saving, isSaving] = useState(false);
  return (
    <Box>
      <Heading size="md">My grade boundaries</Heading>
      <HStack>
        <Button
          mt={2}
          onClick={() => {
            setGradeMap(presets["Victoria University of Wellington"]);
          }}
          size="sm"
          colorScheme={"orange"}
        >
          Load defaults
        </Button>
      </HStack>
      <Flex wrap={"wrap"}>
        {predefinedGrades.map((predefinedGrade) => (
          <GradeBoundaryEntry
            key={predefinedGrade}
            onChange={(g) => {
              setGradeMap(g);
            }}
            userGradeMap={gradeMap}
            gradeString={predefinedGrade}
          />
        ))}
      </Flex>
      <Box>
        <Button
          colorScheme={"brand"}
          isLoading={saving}
          onClick={async () => {
            isSaving(true);
            const res = await fetch(`/api/user`, {
              headers: { "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ gradeMap: gradeMap }),
            });
            if (res.ok) {
              const data = await res.json();
              user.setUser(data);
              isSaving(false);
              toast({
                title: "Updated.",
                status: "success",
              });
            } else {
              toast({
                title: "An error occurred.",
                status: "error",
              });
            }
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

const Account: NextPage = () => {
  const data = useSession();
  const user = useUserContext();
  const router = useRouter();
  const deleteModal = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <>
      <AlertDialog {...deleteModal} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete account</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete your account? You can't undo this action afterwards.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={deleteModal.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme={"red"}
                isLoading={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  const response = await fetch("/api/user", {
                    method: "DELETE",
                  });
                  if (response.ok) {
                    const r = await signOut({ redirect: false, callbackUrl: "/" });
                    toast({
                      title: "Account deleted.",
                      duration: 4000,
                      status: "success",
                    });
                    router.push(r.url);
                  }
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Head>
        <title>My account</title>
      </Head>
      <TopBar />
      <Box paddingX={[6, 12]}>
        <Heading paddingBottom={6}>My account</Heading>
        <Stack spacing={12}>
          <Flex direction="column" p={4} overflowX="auto" boxShadow={"md"} rounded="md" bgColor={"Background"}>
            <Flex alignItems="center">
              <Avatar src={data.data?.user?.image ?? ""} name={data.data?.user?.name ?? ""} size={"md"} mr={4} />
              <Box>
                <Heading size="md">{data.data?.user?.name}</Heading>
                <Text fontSize="md" color={"ActiveCaption"}>
                  {data.data?.user?.email}
                </Text>
              </Box>
            </Flex>
            <Box>
              <HStack mt={2}>
                <Button
                  size="sm"
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify({
                      meta: {
                        created: new Date().getTime(),
                        service: "AWCH_GK_PUBLIC_VCL",
                        server: "SYD02.SECURE.GRADEKEEPER.XYZ",
                      },
                      data: user?.user,
                    })
                  )}`}
                  as={"a"}
                  colorScheme={"yellow"}
                  download={`GK_EXPORT_${new Date().getTime()}.json`}
                >
                  Download my data
                </Button>
                <Button onClick={deleteModal.onOpen} size="sm" colorScheme={"red"}>
                  Delete my data
                </Button>
              </HStack>
            </Box>
          </Flex>
          {user?.user?.gradeMap && <GradeMapEditor gradeMap={user?.user?.gradeMap as object} />}
        </Stack>

        <Box mt={12}>
          <Text>Gradekeeper is &copy; 2022 Animals With Cool Hats, Inc.</Text>
          <Text>Gradekeeper is powered by open-source software.</Text>
          <Text>
            Gradekeeper is{" "}
            <Link color="brand.500" href="https://github.com/jacksonrakena/gradekeeper" isExternal>
              open-source <ExternalLinkIcon mx="2px" />
            </Link>
            .
          </Text>
          {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && (
            <Text>
              Version <Code>{process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}</Code>
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Account;
