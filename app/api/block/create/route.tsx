import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { gkAuthorizedRoute } from "../../../../lib/api/gkRoute";

const route = gkAuthorizedRoute(
  async (
    req: NextRequest,
    ctx: {
      userId: string;
      services: {
        db: PrismaClient;
      };
    }
  ) => {
    const data = await ctx.services.db.studyBlock.create({
      data: {
        userId: ctx.userId,
        ...(await req.json()),
      },
    });
    if (data) return NextResponse.json(data);
    return NextResponse.json({ error: "error" }, { status: 404 });
  }
);

export { route as POST };
