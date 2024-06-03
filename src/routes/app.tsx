import { useSession } from "../lib/state/auth";
import Dashboard from "./dashboard";
import MarketingHome from "./MarketingHome";

export const App = () => {
  const session = useSession();
  return (
    <>
      {session && <Dashboard />}
      {!session && <MarketingHome />}
    </>
  );
};
