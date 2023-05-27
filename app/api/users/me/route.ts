// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AuthorizedRequestContext, gkAuthorizedRoute } from "../../../../lib/api/gkRoute";

export const getUserQuery = Prisma.validator<Prisma.UserArgs>()({
  select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
});
const GET = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext) => {
  const primsa = new PrismaClient();
  const data = await primsa.user.findUnique({
    where: { id: ctx.userId },
    ...getUserQuery,
  });
  if (!data) {
    const data = await primsa.user.create({
      data: {
        id: ctx.userId,
        gradeMap: {
          "0.4": "D",
          "0.5": "C-",
          "0.6": "C+",
          "0.7": "B",
          "0.8": "A-",
          "0.9": "A+",
          "0.55": "C",
          "0.65": "B-",
          "0.75": "B+",
          "0.85": "A",
        },
      },
    });
    return NextResponse.json(data);
  }
  return NextResponse.json(data ?? {});
});
const DELETE = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext) => {
  await ctx.services.db.user.delete({
    where: { id: ctx.userId },
  });
  return NextResponse.json({});
});
const POST = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext) => {
  const updatedUser = await ctx.services.db.user.update({
    where: { id: ctx.userId },
    data: { ...req.body },
    include: { studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
  });
  return NextResponse.json(updatedUser);
});
export { GET, DELETE, POST };
