import { Button, SkeletonText } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useLogin, useSession } from "../../../lib/state/auth";
import AccountButton from "./AccountButton";

export const TopBar = (props: { leftWidget?: ReactElement }) => {
  const login = useLogin();
  const session = useSession();

  return (
    <div>
      <div className="w-full p-2 flex flex-row">
        <div className="grow">{props.leftWidget}</div>
        <div>
          <SkeletonText isLoaded={!!session}>
            {session ? (
              <AccountButton />
            ) : (
              <>
                <Button
                  colorScheme={"brand"}
                  onClick={() => {
                    login();
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
