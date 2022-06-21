// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, SubjectSubcomponent } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../../../../../../lib/api/gkRoute";

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);
  const primsa = new PrismaClient();
  if (req.method === "POST") {
    const { id, comp_id } = req.query;

    const targetComponent = await primsa.subjectComponent.findFirst({
      where: { id: comp_id.toString(), subject: { studyBlock: { userId: session.user?.email } } },
      include: { subcomponents: true },
    });
    if (!targetComponent) return res.status(400);
    if (req.body.subcomponents) {
      const initupd = await primsa.subjectComponent.update({
        where: {
          id: comp_id.toString(),
        },
        data: {
          ...req.body,
          subcomponentsArray: undefined,
          subcomponents: { deleteMany: [{ componentId: { not: "" } }] },
        },
      });
      const replacementSubcomponents = req.body.subcomponents.map((e: Partial<SubjectSubcomponent>) => {
        return { ...e, componentId: undefined };
      });
      const resultdata = await primsa.subjectComponent.update({
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

      if (resultdata) return res.status(200).json(resultdata);
      return res.status(500);
    }
    return res.status(200).send({});
  }
});
