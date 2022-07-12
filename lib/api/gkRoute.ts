import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

export function gkRoute<T>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>) => any
): (req: NextApiRequest, res: NextApiResponse<T>) => any {
  return withSentry(handler);
}

export function gkAuthorizedRoute<T>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>, userEmail: string, session: Session) => any
): (req: NextApiRequest, res: NextApiResponse<T>) => any {
  return gkRoute(async (req, res) => {
    const session = await unstable_getServerSession(req, res, nextAuthOptions);
    if (!session || !session.user?.email) return res.status(400);
    return handler(req, res, session.user.email, session);
  });
}
