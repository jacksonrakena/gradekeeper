import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

const googleOauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export function gkRoute<T>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>) => any
): (req: NextApiRequest, res: NextApiResponse<T>) => any {
  return handler;
}

const prisma = new PrismaClient();
export function gkAuthorizedRoute<T>(
  handler: (
    req: NextApiRequest,
    res: NextApiResponse<T>,
    ctx: {
      userId: string;
      services: {
        db: PrismaClient;
      };
    }
  ) => any
): (req: NextApiRequest, res: NextApiResponse<T>) => any {
  return gkRoute(async (req, res) => {
    var userId = await tryVerifySession(req, res);

    if (!userId) {
      userId = await tryVerifyMobileIdToken(req, res);
    }

    if (!userId) {
      res.status(400).send({ error: "Not authorized" } as T);
      return;
    }

    return await handler(req, res, { services: { db: prisma }, userId: userId });
  });
}

async function tryVerifySession(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session || !session.user?.email) return null;
  return session.user.email;
}

async function tryVerifyMobileIdToken(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const ticket = await googleOauthClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    const userid = payload?.email;

    if (userid) {
      console.log("Google ID token verification passed for " + userid);
      return userid;
    }
  } catch (e) {}
  console.log("token verification failed");
  return null;
}
