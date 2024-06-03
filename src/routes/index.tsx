import { useSession } from "../lib/state/auth";
import Dashboard from "./index.authorised";
import MarketingHome from "./index.unauthorised";

export const Index = () => {
  const session = useSession();
  return (
    <>
      {session && <Dashboard />}
      {!session && <MarketingHome />}
    </>
  );
};
