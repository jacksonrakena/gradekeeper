import { routes, useApi } from "@/lib/net/fetch";
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
  Divider,
  Flex,
  HStack,
  Heading,
  Link,
  NumberInput,
  NumberInputField,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { TopBar } from "../components/app/nav/TopBar";
import { useAuth, useLogout } from "../lib/state/auth";
import { ProcessedUserState, useInvalidator } from "../lib/state/course";
import themeConstants from "../lib/theme";

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
            props.onChange(newGradeMap);
          }}
          isChecked={definedGrades.includes(props.gradeString)}
        />
        <Text width="25px" fontWeight={"semibold"}>
          {props.gradeString}
        </Text>
        <NumberInput
          onChange={(c) => {
            var newmap = Object.fromEntries(Object.entries(props.userGradeMap).filter((e) => e[1] !== props.gradeString));
            props.onChange({ ...newmap, [c]: props.gradeString });
          }}
          m={0}
          variant={"outline"}
          maxW={24}
          value={value ? value[0] : ""}
        >
          <NumberInputField disabled={!value} />
        </NumberInput>
      </HStack>
    </Box>
  );
};

const GradeMapEditor = (props: { gradeMap: object }) => {
  const { invalidate } = useInvalidator();
  const toast = useToast();
  const api = useApi();
  const [gradeMap, setGradeMap] = useState(props.gradeMap);
  const [saving, isSaving] = useState(false);
  const accCardBg = useColorModeValue("white", themeConstants.darkModeContrastingColor);
  return (
    <Box p={4} maxW={800} overflowX="auto" boxShadow={"md"} rounded="md" bgColor={accCardBg}>
      <Stack spacing={6}>
        <Heading size="md">My grade boundaries</Heading>
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
        <HStack>
          <Button
            colorScheme={"brand"}
            isLoading={saving}
            onClick={async () => {
              isSaving(true);
              const res = await api.request(routes.updateMe(), {
                method: "DELETE",
                body: JSON.stringify({ gradeMap: gradeMap }),
              });
              if (res) {
                await invalidate();
                isSaving(false);
                toast({
                  title: "Updated.",
                  status: "success",
                });
              }
            }}
          >
            Save
          </Button>{" "}
          <Button
            mt={2}
            onClick={() => {
              setGradeMap(presets["Victoria University of Wellington"]);
            }}
            colorScheme={"red"}
            type="reset"
          >
            Reset
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

const Account = () => {
  const user = useAtomValue(ProcessedUserState);
  const api = useApi();
  const auth = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const deleteModal = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const accCardBg = useColorModeValue("white", themeConstants.darkModeContrastingColor);
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
                  const response = await api.delete(routes.deleteMe());
                  if (response) {
                    logout();
                    toast({
                      title: "Account deleted.",
                      duration: 4000,
                      status: "success",
                    });
                    navigate("/");
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

      <TopBar />
      <Box paddingX={[6, 12]}>
        <Heading paddingBottom={6}>My account</Heading>
        <Stack spacing={12}>
          <Stack spacing={12}>
            <Flex direction="column" p={4} overflowX="auto" boxShadow={"md"} rounded="md" bgColor={accCardBg}>
              <Flex alignItems="center">
                <Avatar src={auth.session?.picture} name={auth.session?.name ?? ""} size={"md"} mr={4} />
                <Box>
                  <Heading size="md">{auth.session?.name}</Heading>
                  <Text fontSize="md" color={"GrayText"}>
                    {auth.session?.id}
                  </Text>
                </Box>
              </Flex>
            </Flex>
            {user?.gradeMap && <GradeMapEditor gradeMap={user?.gradeMap as object} />}
          </Stack>

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
                    data: user,
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
        </Stack>
      </Box>
      <Divider marginTop={12} marginBottom={8} />
      <Box paddingX={[6, 12]} marginBottom={10}>
        <Box fontSize="sm" textColor={"GrayText"}>
          <Text>Gradekeeper is &copy; Jackson Rakena.</Text>
          <Text>Gradekeeper is powered by open-source software.</Text>
          <Text>
            Gradekeeper is{" "}
            <Link color="brand.500" href="https://github.com/gradekeeper/gradekeeper" isExternal>
              open-source <ExternalLinkIcon mx="2px" />
            </Link>
            .
          </Text>
          <Text>
            Version <Code>{import.meta.env.VITE_VERCEL_GIT_COMMIT_REF}</Code>/
            <Code>{import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7)}</Code> by{" "}
            <Code>{import.meta.env.VITE_VERCEL_GIT_COMMIT_AUTHOR_LOGIN}</Code>: "{import.meta.env.VITE_VERCEL_GIT_COMMIT_MESSAGE}" (mode{" "}
            <Code>{import.meta.env.MODE}</Code>)
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Account;
