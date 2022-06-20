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
          const singularMap = {
            'assignments': 'Assignment',
            'labs': 'Lab',
            'lectures': 'Lecture',
            'projects': 'Project',
            'quizzes': 'Quiz',
            'tests': 'Test',
            'exams': 'Exam'
          }
          const nameOfSubcomponentSingular: string = Object.keys(singularMap).includes(subc.name.toLowerCase()) ? singularMap[subc.name.toLowerCase()] : subc.name;
          var insdata = {
            subjectId: data.id,
            name: subc.name,
            id: subc.id,
            nameOfSubcomponentSingular: nameOfSubcomponentSingular,
            numberOfSubComponentsToDrop_Lowest: subc.dropLowest,
            subjectWeighting: subc.weighting,
            subcomponentsArray: Array.of<Partial<SubjectSubcomponent>>(),
          };
          for (var iz = 0; iz < Number.parseInt(subc.numberOfSubcomponents); iz++) {
            insdata.subcomponentsArray.push({
              isCompleted: false,
              numberInSequence: iz + 1,
              id: cuid(),
              gradeValuePercentage: subc.weighting / Number.parseInt(subc.numberOfSubcomponents),
            });
          }
          return insdata;
        }),
      });
      if (!componentData) return res.status(500).send({});
    }
    if (data) return res.status(200).json(data);
    return res.status(404);
  }
});
