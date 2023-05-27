// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SubjectSubcomponent } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AuthorizedRequestContext, gkAuthorizedRoute } from "../../../../../../../../lib/api/gkRoute";

const POST = gkAuthorizedRoute(
  async (req: NextRequest, ctx: AuthorizedRequestContext, { params }: { params: { id: string; comp_id: string } }) => {
    const { id, comp_id } = params;
    const body = await req.json();

    const targetComponent = await ctx.services.db.subjectComponent.findFirst({
      where: { id: comp_id?.toString(), subject: { studyBlock: { userId: ctx.userId } } },
      include: { subcomponents: true },
    });
    if (!targetComponent) return NextResponse.json({}, { status: 404 });
    if (body.subcomponents) {
      const initupd = ctx.services.db.subjectComponent.update({
        where: {
          id: comp_id?.toString(),
        },
        data: {
          ...body,
          subcomponents: { deleteMany: [{ componentId: { not: "" } }] },
        },
      });
      const replacementSubcomponents = body.subcomponents.map((e: Partial<SubjectSubcomponent>) => {
        return { ...e, componentId: undefined };
      });
      const insertNewSubcomponents = ctx.services.db.subjectComponent.update({
        where: { id: targetComponent.id },
        data: {
          subcomponents: {
            createMany: {
              data: replacementSubcomponents,
            },
          },
        },
        include: { subcomponents: true },
      });
      const resultdata = await ctx.services.db.$transaction([initupd, insertNewSubcomponents]);

      if (resultdata) return NextResponse.json(resultdata[1]);
      return NextResponse.json({}, { status: 500 });
    } else if (body.subjectWeighting) {
      const initupd = ctx.services.db.subjectComponent.update({
        where: {
          id: comp_id?.toString(),
        },
        data: {
          ...body,
        },
      });
      const result = await ctx.services.db.$transaction([initupd]);
      return NextResponse.json({});
    } else if (body.name) {
      const initupd = await ctx.services.db.subjectComponent.update({
        where: {
          id: comp_id?.toString(),
        },
        data: {
          name: body.name,
        },
      });
      return NextResponse.json(initupd);
    }
    return NextResponse.json({}, { status: 400 });
  }
);

export { POST };
