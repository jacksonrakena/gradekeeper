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
    });
    if (!targetComponent) return res.status(400);

    const replacementSubcomponents = req.body.subcomponents.map((e: Partial<SubjectSubcomponent>) => {
      e.componentId = undefined;
      return {
        where: { id: e.id },
        data: e,
      };
    });
    const resultdata = await primsa.subjectComponent.update({
      where: { id: comp_id.toString() },
      data: {
        ...req.body,
        subcomponents: {
          updateMany: replacementSubcomponents,
        },
      },
      include: { subcomponents: true },
    });
    if (resultdata) return res.status(200).json(resultdata);
    return res.status(500);
  }
});
