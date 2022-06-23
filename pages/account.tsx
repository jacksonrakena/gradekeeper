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
  Stack,
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

const Account: NextPage = () => {
  const data = useSession();
  const user = useUserContext();
  const router = useRouter();
  const deleteModal = useDisclosure();
  const cancelRef = useRef<Button>();
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
      <Box paddingX={12}>
        <Heading paddingBottom={6}>My account</Heading>
        <Stack spacing={12}>
          <Flex p={4} boxShadow={"md"} rounded="md" bgColor={"Background"}>
            <Avatar src={data.data?.user?.image} size={"lg"} mr={4} />
            <Box>
              <Heading size="md">{data.data?.user?.name}</Heading>
              <Text>
                Connected to your Google account: <Code>{data.data?.user?.email}</Code>
              </Text>
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
        </Stack>

        <Box mt={12}>
          <Text>Gradekeeper is &copy; 2022 Animals With Cool Hats, Inc.</Text>
          <Text>Gradekeeper is powered by open-source software.</Text>
          <Text>
            Gradekeeper is{" "}
            <Link color="teal.500" href="https://github.com/jacksonrakena/gradekeeper" isExternal>
              open-source <ExternalLinkIcon mx="2px" />
            </Link>
            .
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Account;
