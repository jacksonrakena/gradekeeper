// import Dashboard from "../components/app/dashboard/Dashboard";
// import MarketingHome from "../components/marketing/MarketingHome";
// import { useAuth } from "../state/auth";

// const Home = () => {
//   const data = useSession();
//   const auth = useAuth();
//   return (
//     <div>
//       {(!data || data.status === "unauthenticated") && <MarketingHome />}
//       {data && data.status === "authenticated" && <Dashboard />}
//     </div>
//   );
// };

// export default Home;
import jwtDecode from "jwt-decode";
import { PropsWithChildren, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot, useRecoilValue } from "recoil";
import Dashboard from "../components/app/dashboard/Dashboard";
import MarketingHome from "../components/marketing/MarketingHome";
import { Chakra } from "../lib/theme/Chakra";
import AuthContextProvider, { useAuth } from "../state/auth";
import { useInvalidator, UserState } from "../state/course";
import "../styles/globals.css";

export const InvalidatorManager = (props: PropsWithChildren) => {
  const { invalidate } = useInvalidator();
  const user = useRecoilValue(UserState);
  useEffect(() => {
    if (!user) invalidate();
  }, []);
  return <>{props.children}</>;
};

document.body.innerHTML = '<div id="app"></div>';
const root = createRoot(document.getElementById("app"));
const Inner = () => {
  const auth = useAuth();
  return (
    <>
      {auth.loggedIn && <Dashboard />}
      {!auth.loggedIn && <MarketingHome />}
    </>
  );
};
const getCookie = (key: string) => {
  var b = window.document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
};
const Root = () => {
  const [authContext, setAuthContext] = useState({
    cookie: null,
    loggedIn: false,
  });
  useEffect(() => {
    console.log("using auth");
    const cookie = getCookie("GK_COOKIE");
    console.log("cookie: ", cookie);
    const d = jwtDecode(cookie);
    console.log(d);
    if (d && d.exp && d.exp > Date.now() / 1000) {
      console.log("valid");
      setAuthContext({ cookie: d, loggedIn: true });
    }
  }, []);
  return (
    <RecoilRoot>
      <AuthContextProvider value={authContext}>
        <InvalidatorManager>
          <Chakra>
            {/* <SlideFade key={router.route} in={true}> */}
            <Inner />
            {/* </SlideFade> */}
          </Chakra>
        </InvalidatorManager>
      </AuthContextProvider>
    </RecoilRoot>
  );
};
root.render(<Root />);
