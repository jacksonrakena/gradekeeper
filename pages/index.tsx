import { Prisma } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Dashboard from "../components/app/dashboard/Dashboard";
import MarketingHome from "../components/marketing/MarketingHome";
import { GetUserResponse } from "../state/course";
import { getUserQuery } from "./api/user";


const Home: NextPage = () => {
  const data = useSession();
  return (
    <div>
      {(!data || data.status === "unauthenticated") && <MarketingHome />}
      {data && data.status === "authenticated" && <Dashboard />}
    </div>
  );
};

export default Home;
