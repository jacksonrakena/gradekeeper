import { SlideFade } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Chakra } from "../Chakra";
import { _undefined } from "../lib/logic";
import "../styles/globals.css";
import { getUserQuery } from "./api/user";
import { UserContext } from "./UserContext";

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
    <SessionProvider session={session}>
      <Chakra cookies={pageProps.cookies}>
        <UserContext.Provider
          value={{
            user: user,
            setUser: setUser,
            updateCourse: (courseId, replacementCourse) => {
              setUser({
                ...user,
                gradeMap: user?.gradeMap ?? {},
                studyBlocks:
                  user?.studyBlocks.map((sb) => {
                    if (sb.id === replacementCourse.studyBlockId) {
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
  );
}

export default MyApp;
