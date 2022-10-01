import { PrismaClient } from "@prisma/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Dashboard from "../components/app/dashboard/Dashboard";
import MarketingHome from "../components/marketing/MarketingHome";
import { UserState } from "../state/course";
import { nextAuthOptions } from "./api/auth/[...nextauth]";
import { getUserInfo } from "./api/users/me";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, nextAuthOptions);

  return {
    props: {
      initialUser: !session || !session.user?.email ? null : await getUserInfo(new PrismaClient(), session.user.email),
    },
  };
}

const Home = (serverProps: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const data = useSession();
  const setInitialUserState = useSetRecoilState(UserState);
  useEffect(() => {
    if (serverProps.initialUser) {
      setInitialUserState(serverProps.initialUser);
    }
  }, []);
  return (
    <div>
      {(!data || data.status === "unauthenticated") && <MarketingHome />}
      {data && data.status === "authenticated" && <Dashboard />}
    </div>
  );
};

export default Home;
