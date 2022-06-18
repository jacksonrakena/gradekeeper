// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, SubjectSubcomponent } from "@prisma/client";
import cuid from "cuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../../../../lib/api/gkRoute";
import { ComponentDto } from "../../../../blocks/[block_id]/courses/create";

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);

  const primsa = new PrismaClient();
  if (req.method === "POST") {
    const inputdto: {
      name: string;
      codeName: string;
      codeNo: string;
      color: string;
      components: ComponentDto[];
    } = req.body;
    for (var iz = 0; iz < inputdto.components.length; iz++) {
      inputdto.components[iz].id = cuid();
    }

    const data = await primsa.subject.create({
      data: {
        studyBlockId: req.query["block_id"].toString(),
        color: inputdto.color,
        courseCodeName: inputdto.codeName,
        courseCodeNumber: inputdto.codeNo,
        longName: inputdto.name,
      },
    });
    if (data) {
      var componentData = await primsa.subjectComponent.createMany({
        data: inputdto.components.map((subc) => {
          const emptysubcarr: any[] = [];
          var insdata = {
            subjectId: data.id,
            name: subc.name,
            id: subc.id,
            nameOfSubcomponentSingular: subc.name,
            numberOfSubComponentsToDrop_Lowest: subc.dropLowest,
            subjectWeighting: subc.weighting,
          };
          return insdata;
        }),
      });
      if (!componentData) return res.status(500).send({});
      const subcomponents: Partial<SubjectSubcomponent>[] = [];
      for (var i2 = 0; i2 < inputdto.components.length; i2++) {
        for (var i3 = 0; i3 < inputdto.components[i2].numberOfSubcomponents; i3++) {
          subcomponents.push({
            componentId: inputdto.components[i2].id,
            isCompleted: false,
            numberInSequence: i3 + 1,
            id: cuid(),
            gradeValuePercentage: inputdto.components[i2].weighting / inputdto.components[i2].numberOfSubcomponents,
          });
        }
      }
      await primsa.subjectSubcomponent.createMany({ data: subcomponents });
    }
    if (data) return res.status(200).json(data);
    return res.status(404);
  }
});
