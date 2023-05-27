// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";
import { AuthorizedRequestContext, gkAuthorizedRoute } from "../../../../../../lib/api/gkRoute";

const GET = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext, { params }: { params: { id: string } }) => {
  const data = await ctx.services.db.subject.findFirst({
    where: {
      id: params.id?.toString(),
      studyBlock: { userId: ctx.userId },
    },
    include: {
      components: { include: { subcomponents: true } },
      studyBlock: { select: { name: true, user: { select: { gradeMap: true } } } },
    },
  });
  const otherSubjects = await ctx.services.db.subject.findMany({
    where: { studyBlock: { userId: ctx.userId } },
    include: { studyBlock: true },
  });
  if (data) return NextResponse.json({ ...data, otherSubjects: otherSubjects });
  return NextResponse.json({}, { status: 404 });
});

const DELETE = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext, { params }: { params: { id: string } }) => {
  const query = await ctx.services.db.subject.findFirst({
    where: {
      id: params.id?.toString(),
      studyBlock: { userId: ctx.userId },
    },
  });
  if (!query) return NextResponse.json({}, { status: 400 });
  await ctx.services.db.subject.delete({
    where: {
      id: query.id,
    },
  });
  return NextResponse.json({});
});

const POST = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext, { params }: { params: { id: string } }) => {
  const toupdate = await ctx.services.db.subject.findFirst({
    where: {
      id: params.id?.toString(),
      studyBlock: { userId: ctx.userId },
    },
  });
  if (!toupdate) return NextResponse.json({}, { status: 404 });
  const updated = await ctx.services.db.subject.update({
    where: {
      id: toupdate.id,
    },
    data: { ...(await req.json()) },
    include: { components: { include: { subcomponents: true } } },
  });
  return NextResponse.json(updated);
});

export { POST, GET, DELETE };
