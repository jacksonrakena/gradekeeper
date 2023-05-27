// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SubjectSubcomponent } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { AuthorizedRequestContext, gkAuthorizedRoute } from "../../../../../lib/api/gkRoute";

const POST = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext, { params }: { params: { block_id: string } }) => {
  const blockId = params.block_id?.toString();
  const courseShareCode = (await req.json()).shareCode;

  const originalCourse = await ctx.services.db.subject.findFirst({
    where: {
      id: courseShareCode,
    },
    include: { components: { include: { subcomponents: true } } },
  });
  if (!originalCourse) return NextResponse.json({}, { status: 404 });
  const data = await ctx.services.db.subject.create({
    data: {
      studyBlockId: blockId ?? "",
      courseCodeName: originalCourse.courseCodeName,
      courseCodeNumber: originalCourse.courseCodeNumber,
      longName: originalCourse?.longName,
      color: originalCourse?.color,
      components: {
        createMany: {
          data: originalCourse.components.map((component) => {
            return {
              name: component.name,
              nameOfSubcomponentSingular: component.nameOfSubcomponentSingular,
              numberOfSubComponentsToDrop_Lowest: component.numberOfSubComponentsToDrop_Lowest,
              subjectWeighting: component.subjectWeighting,
            };
          }),
        },
      },
    },
    include: { components: { include: { subcomponents: true } } },
  });
  const subcomponents: Omit<SubjectSubcomponent, "id">[] = [];
  for (var i = 0; i < originalCourse.components.length; i++) {
    const component = originalCourse.components[i];
    for (var s = 0; s < component.subcomponents.length; s++) {
      const originalSubcomponent = component.subcomponents[s];
      subcomponents.push({
        isCompleted: false,
        numberInSequence: originalSubcomponent.numberInSequence,
        overrideName: originalSubcomponent.overrideName,
        componentId: data.components[i].id,
        gradeValuePercentage: 0,
      });
    }
  }
  await ctx.services.db.subjectSubcomponent.createMany({
    data: subcomponents,
  });

  return NextResponse.json(data);
});

export { POST };
