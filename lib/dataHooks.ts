import { Prisma } from "@prisma/client";
import useSWR from "swr";
import { getUserQuery } from "../pages/api/user";
import { fetcher } from "./logic";

export function useFullUser(): { user?: Prisma.UserGetPayload<typeof getUserQuery>; isLoading: boolean; error: string } {
  const { data: user, error } = useSWR<Prisma.UserGetPayload<typeof getUserQuery>>("/api/user", fetcher, {
    revalidateOnFocus: false,
  });
  return {
    user: user,
    error: error,
    isLoading: !error && !user,
  };
}
