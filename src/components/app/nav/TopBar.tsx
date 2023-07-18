import { Button, SkeletonText } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useAuth } from "../../../lib/state/auth";
import AccountButton from "./AccountButton";

export const TopBar = (props: { leftWidget?: ReactElement }) => {
  const auth = useAuth();

  return (
    <div>
      <div className="w-full p-2 flex flex-row">
        <div className="grow">{props.leftWidget}</div>
        <div>
          <SkeletonText isLoaded={auth.loggedIn}>
            {auth.loggedIn ? (
              <AccountButton />
            ) : (
              <>
                <Button
                  colorScheme={"brand"}
                  onClick={() => {
                    auth.logIn();
                  }}
                >
                  Sign in
                </Button>
              </>
            )}
          </SkeletonText>
        </div>
      </div>
    </div>
  );
};
