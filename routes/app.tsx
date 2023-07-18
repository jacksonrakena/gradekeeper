import { useAuth } from "../src/lib/state/auth";
import Dashboard from "./dashboard";
import MarketingHome from "./MarketingHome";

export const App = () => {
  const auth = useAuth();
  return (
    <>
      {auth.loggedIn && <Dashboard />}
      {!auth.loggedIn && <MarketingHome />}
    </>
  );
};
