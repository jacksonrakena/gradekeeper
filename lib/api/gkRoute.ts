import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nextAuthOptions } from "../../app/api/auth/[...nextauth]/route";

const googleOauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export type RouteHandler = (req: NextRequest, ...args) => Promise<NextResponse>;
export type AuthorizedRequestContext = { userId: string; services: { db: PrismaClient } };
export type AuthorizedRouteHandler = (req: NextRequest, ctx: AuthorizedRequestContext, ...args) => Promise<NextResponse>;

export function gkRoute(handler: RouteHandler): RouteHandler {
  return handler;
}

const prisma = new PrismaClient();
export function gkAuthorizedRoute(handler: AuthorizedRouteHandler): RouteHandler {
  return gkRoute(async (req, ...args) => {
    var userId = await tryVerifySession();

    if (!userId) {
      userId = await tryVerifyMobileIdToken(req);
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 400 });
    }

    return await handler(req, { services: { db: prisma }, userId: userId }, ...args);
  });
}

async function tryVerifySession(): Promise<string | null> {
  const session = await getServerSession(nextAuthOptions);
  if (!session || !session.user?.email) return null;
  return session.user.email;
}

async function tryVerifyMobileIdToken(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
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
