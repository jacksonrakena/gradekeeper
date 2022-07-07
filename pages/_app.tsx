import { SlideFade } from "@chakra-ui/react";
import { Prisma, StudyBlock } from "@prisma/client";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ProcessedUserInfo, _undefined } from "../lib/logic";
import { Chakra } from "../lib/theme/Chakra";
import { AppContext, UserContext } from "../lib/UserContext";
import "../styles/globals.css";
import { getUserQuery } from "./api/user";

function MyApp({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  const [user, setUser] = useState(_undefined<ProcessedUserInfo>());
  const contextValue: AppContext = {
    user: user,
    setUser: setUser,
    redownload: async () => {
      fetch("/api/user")
        .then((d) => d.json())
        .then((e) => {
          const prismaResponse: Prisma.UserGetPayload<typeof getUserQuery> = e;
          setUser({
            ...prismaResponse,
            processedStudyBlocks: prismaResponse.studyBlocks.map((rawStudyBlock) =>
              processStudyBlock(rawStudyBlock, prismaResponse.gradeMap)
            ),
          });
        })
        .catch(() => {});
    },
    updateCourse: (courseId, replacementCourse) => {
      setUser({
        ...user,
        gradeMap: user?.gradeMap ?? {},
        processedStudyBlocks:
          user?.processedStudyBlocks.map((sb) => {
            if (!replacementCourse) {
              if (sb.processedCourses.filter((d) => d.id === courseId).length > 0) {
                return {
                  ...sb,
                  processedCourses: sb.processedCourses.filter((subj) => subj.id !== courseId),
                };
              }
              return sb;
            } else {
              if (sb.id === replacementCourse.studyBlockId) {
                if (sb.processedCourses.filter((aa) => aa.id === courseId).length === 0) {
                  sb.processedCourses.push(replacementCourse);
                  return sb;
                }
                return {
                  ...sb,
                  processedCourses: sb.processedCourses.map((subj) => {
                    if (subj.id === replacementCourse.id) return replacementCourse;
                    return subj;
                  }),
                };
              }
              return sb;
            }
          }) ?? [],
      });
    },
  };
  useEffect(() => {
    contextValue.redownload();
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <SessionProvider session={session}>
        <Chakra cookies={pageProps.cookies}>
          <UserContext.Provider value={contextValue}>
            <SlideFade key={router.route} in={true}>
              <Component {...pageProps} />
            </SlideFade>
          </UserContext.Provider>
        </Chakra>
      </SessionProvider>
    </>
  );
}

export default MyApp;
function processStudyBlock(
  rawStudyBlock: StudyBlock & {
    subjects: (import(".prisma/client").Subject & {
      components: (import(".prisma/client").SubjectComponent & { subcomponents: import(".prisma/client").SubjectSubcomponent[] })[];
    })[];
  },
  gradeMap: string | number | boolean | Prisma.JsonObject | Prisma.JsonArray | null
): any {
  throw new Error("Function not implemented.");
}
