// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import cuid from "cuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ComponentDto } from "../../../../../components/app/course/CreateCourse";
import { gkRoute } from "../../../../../lib/api/gkRoute";
import { singularMap } from "../../../../../lib/logic";

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

    const newCourseId = cuid();
    if (inputdto.components.map((e) => Number.parseInt(e.numberOfSubcomponents)).reduce((a, b) => a + b, 0) > 100) {
      return res.status(400).json({ error: "Total number of subcomponents must not exceed 100." });
    }
    if (inputdto.components.map((e) => e.weighting).reduce((a, b) => a + b) !== 1) {
      return res.status(400).json({ error: "Course components must add up to 100%." });
    }
    const subjectCreationQuery = primsa.subject.create({
      data: {
        id: newCourseId,
        studyBlockId: req.query["block_id"].toString(),
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
        numberOfSubComponentsToDrop_Lowest: subc.dropLowest,
        subjectWeighting: subc.weighting,
      };
      for (var iz = 0; iz < Number.parseInt(subc.numberOfSubcomponents); iz++) {
        emptysubcarr.push({
          isCompleted: false,
          numberInSequence: iz + 1,
          id: cuid(),
          componentId: subc.id,
          gradeValuePercentage: subc.weighting / Number.parseInt(subc.numberOfSubcomponents),
        });
      }
      return insdata;
    });
    const componentCreationQuery = primsa.subjectComponent.createMany({
      data: components,
    });
    const subcomponentCreationQuery = primsa.subjectSubcomponent.createMany({ data: emptysubcarr });
    const transaction = await primsa.$transaction([subjectCreationQuery, componentCreationQuery, subcomponentCreationQuery]);
    if (!transaction) return res.status(500).send({});

    if (transaction[0]) return res.status(200).json(transaction[0]);
    return res.status(404);
  }
});
