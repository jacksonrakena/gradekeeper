// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cuid from "cuid";
import { NextRequest, NextResponse } from "next/server";
import { ComponentDto } from "../../../../../../components/app/dashboard/course/CreateCourse";
import { AuthorizedRequestContext, gkAuthorizedRoute } from "../../../../../../lib/api/gkRoute";
import { singularMap } from "../../../../../../lib/logic/core";

const POST = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext, { params }: { params: { block_id: string } }) => {
  if (req.method === "POST") {
    const inputdto: {
      name: string;
      codeName: string;
      codeNo: string;
      color: string;
      components: ComponentDto[];
    } = await req.json();
    for (var iz = 0; iz < inputdto.components.length; iz++) {
      inputdto.components[iz].id = cuid();
    }

    const newCourseId = cuid();
    if (inputdto.components.map((e) => Number.parseInt(e.numberOfSubcomponents)).reduce((a, b) => a + b, 0) > 100) {
      return NextResponse.json({ error: "Total number of subcomponents must not exceed 100." }, { status: 400 });
    }
    const input = inputdto.components.map((e) => Number.parseFloat(e.weighting)).reduce((a, b) => a + b);
    if (input !== 1 && Math.round(input) !== 1) {
      console.log(JSON.stringify(inputdto.components));
      console.log(inputdto.components.map((e) => Number.parseFloat(e.weighting)).reduce((a, b) => a + b));
      return NextResponse.json({ error: "Course components must add up to 100%." }, { status: 400 });
    }
    const subjectCreationQuery = ctx.services.db.subject.create({
      data: {
        id: newCourseId,
        studyBlockId: params.block_id?.toString() ?? "",
        color: inputdto.color,
        courseCodeName: inputdto.codeName,
        courseCodeNumber: inputdto.codeNo,
        longName: inputdto.name,
      },
    });
    const emptysubcarr: any[] = [];
    const components = inputdto.components.map((subc) => {
      const lowerCaseSingulars = Object.keys(singularMap).map((d) => d.toLowerCase());
      const nameOfSubcomponentSingular = lowerCaseSingulars.includes(subc.name.toLowerCase())
        ? Object.values(singularMap)[lowerCaseSingulars.indexOf(subc.name.toLowerCase())]
        : subc.name;
      var insdata = {
        subjectId: newCourseId,
        name: subc.name,
        id: subc.id,
        nameOfSubcomponentSingular: nameOfSubcomponentSingular,
        numberOfSubComponentsToDrop_Lowest: Number.parseFloat(subc.dropLowest),
        subjectWeighting: Number.parseFloat(subc.weighting),
      };
      for (var iz = 0; iz < Number.parseInt(subc.numberOfSubcomponents); iz++) {
        emptysubcarr.push({
          isCompleted: false,
          numberInSequence: iz + 1,
          id: cuid(),
          componentId: subc.id,
          gradeValuePercentage: Number.parseFloat(subc.weighting) / Number.parseInt(subc.numberOfSubcomponents),
        });
      }
      return insdata;
    });
    const componentCreationQuery = ctx.services.db.subjectComponent.createMany({
      data: components,
    });
    const subcomponentCreationQuery = ctx.services.db.subjectSubcomponent.createMany({ data: emptysubcarr });
    const transaction = await ctx.services.db.$transaction([subjectCreationQuery, componentCreationQuery, subcomponentCreationQuery]);
    if (!transaction) return NextResponse.json({}, { status: 500 });

    if (transaction[0]) return NextResponse.json(transaction[0]);
    return NextResponse.json({}, { status: 404 });
  }
});
export { POST };
