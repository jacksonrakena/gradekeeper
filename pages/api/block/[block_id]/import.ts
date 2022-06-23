// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, SubjectSubcomponent } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkAuthorizedRoute } from "../../../../lib/api/gkRoute";

export default gkAuthorizedRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);
  const blockId = req.query["block_id"].toString();
  const courseShareCode = req.body.shareCode;

  const primsa = new PrismaClient();

  if (req.method === "POST") {
    const originalCourse = await primsa.subject.findFirst({
      where: {
        id: courseShareCode,
      },
      include: { components: { include: { subcomponents: true } } },
    });
    if (!originalCourse) return res.status(404).json({});
    const data = await primsa.subject.create({
      data: {
        studyBlockId: req.query["block_id"].toString(),
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
    const subcomponents: Partial<SubjectSubcomponent>[] = [];
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
    // @ts-ignore
    await primsa.subjectSubcomponent.createMany({
      data: subcomponents,
    });

    return res.status(200).json(data);
  }
});
