// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../lib/api/gkRoute";
import { database } from "../../lib/mgTypes";

export const getUserQuery = Prisma.validator<Prisma.UserArgs>()({
  select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
});

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);

  const primsa = new PrismaClient();
  if (req.method === "GET") {
    const data = await primsa.user.findUnique({
      where: { id: session.user?.email },
      select: {
        gradeMap: true,
        studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } },
      },
    });
    if (!data) {
      const data = await primsa.user.create({
        data: {
          id: session.user?.email,
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
      return res.status(200).json(data ?? {});
    }
    for (var i = 0; i < data.studyBlocks.length; i++) {
      for (var s = 0; s < data.studyBlocks[i].subjects.length; s++) {
        for (var c = 0; c < data.studyBlocks[i].subjects[s].components.length; c++) {
          const component = data.studyBlocks[i].subjects[s].components[c];
          if (!component.subcomponentsArray && component.subcomponents.length > 0) {
            await primsa.subjectComponent.update({
              where: {
                id: component.id,
              },
              data: {
                subcomponentsArray: component.subcomponents,
              },
            });
          }
        }
      }
    }
    return res.status(200).json(data ?? {});
  } else if (req.method === "POST") {
    if (req.body.data.user_id !== session.user?.email) return res.status(400).json({ error: "cannot update another user" });
    return res.status(200).json(req.body.data);
  }
});
