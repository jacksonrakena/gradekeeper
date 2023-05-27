// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AuthorizedRequestContext, gkAuthorizedRoute } from "../../../../lib/api/gkRoute";

export const getUserQuery = Prisma.validator<Prisma.UserArgs>()({
  select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
});
const route = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext) => {
  const primsa = new PrismaClient();
  if (req.method === "GET") {
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
  }
  if (req.method === "DELETE") {
    await primsa.user.delete({
      where: { id: ctx.userId },
    });
    return NextResponse.json({});
  }
  if (req.method === "POST") {
    const updatedUser = await primsa.user.update({
      where: { id: ctx.userId },
      data: { ...req.body },
      include: { studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
    });
    return NextResponse.json(updatedUser);
  }
});
export { route as GET };
