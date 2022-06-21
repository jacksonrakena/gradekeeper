import { SlideFade } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Chakra } from "../Chakra";
import { _undefined } from "../lib/logic";
import "../styles/globals.css";
import { UserContext } from "../UserContext";
import { getUserQuery } from "./api/user";

function MyApp({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  const [user, setUser] = useState(_undefined<Prisma.UserGetPayload<typeof getUserQuery>>());
  useEffect(() => {
    fetch("/api/user")
      .then((d) => d.json())
      .then((e) => {
        setUser(e);
      })
      .catch(() => {});
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={session}>
        <Chakra cookies={pageProps.cookies}>
          <UserContext.Provider
            value={{
              user: user,
              setUser: setUser,
              deleteCourse: (courseId) => {
                setUser({
                  ...user,
                  gradeMap: user?.gradeMap ?? {},
                  studyBlocks:
                    user?.studyBlocks.map((sb) => {
                      if (sb.subjects.filter((d) => d.id === courseId).length > 0) {
                        return {
                          ...sb,
                          subjects: sb.subjects.filter((subj) => subj.id !== courseId),
                        };
                      }
                      return sb;
                    }) ?? [],
                });
              },
              redownload: async () => {
                const d = await fetch("/api/user");
                const e = await d.json();
                setUser(e);
              },
              updateCourse: (courseId, replacementCourse) => {
                setUser({
                  ...user,
                  gradeMap: user?.gradeMap ?? {},
                  studyBlocks:
                    user?.studyBlocks.map((sb) => {
                      if (sb.id === replacementCourse.studyBlockId) {
                        if (sb.subjects.filter((aa) => aa.id === courseId).length === 0) {
                          sb.subjects.push(replacementCourse);
                          return sb;
                        }
                        return {
                          ...sb,
                          subjects: sb.subjects.map((subj) => {
                            if (subj.id === replacementCourse.id) return replacementCourse;
                            return subj;
                          }),
                        };
                      }
                      return sb;
                    }) ?? [],
                });
              },
            }}
          >
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
