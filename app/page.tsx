"use client";

import { useSession } from "next-auth/react";
import Dashboard from "../components/app/dashboard/Dashboard";
import MarketingHome from "../components/marketing/MarketingHome";

const Home = () => {
  const data = useSession();
  return (
    <div>
      {(!data || data.status === "unauthenticated") && <MarketingHome />}
      {data && data.status === "authenticated" && <Dashboard />}
    </div>
  );
};

export default Home;
