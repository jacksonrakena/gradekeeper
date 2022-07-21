import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Dashboard from "../components/app/dashboard/course-list/Dashboard";
import MarketingHome from "../components/marketing/MarketingHome";

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
