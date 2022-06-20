import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export function gkRoute<T>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>) => any
): (req: NextApiRequest, res: NextApiResponse<T>) => any {
  return withSentry(handler);
}

export function gkAuthorizedRoute<T>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>, userEmail: string, session: Session) => any
): (req: NextApiRequest, res: NextApiResponse<T>) => any {
  return gkRoute(async (req, res) => {
    const session = await getSession({ req });
    if (!session || !session.user?.email) return res.status(400);
    return handler(req, res, session.user.email, session);
  });
}