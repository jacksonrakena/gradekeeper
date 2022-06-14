import { NextPage } from "next";
import { useSession } from "next-auth/react";
import CourseList from "../components/app/main/CourseList";
import MarketingHome from "../components/MarketingHome";

const Home: NextPage = () => {
  const data = useSession();
  return (
    <div>
      {(!data || data.status === "unauthenticated") && <MarketingHome />}
      {data && data.status === "authenticated" && <CourseList />}
    </div>
  );
};

export default Home;
