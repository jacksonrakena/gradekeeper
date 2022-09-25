// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, SubjectSubcomponent } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { gkAuthorizedRoute } from "../../../../../../../lib/api/gkRoute";

export default gkAuthorizedRoute(
  async (
    req: NextApiRequest,
    res: NextApiResponse<object>,
    ctx: {
      userId: string;
      services: {
        db: PrismaClient;
      };
    }
  ) => {
    if (req.method === "POST") {
      const { id, comp_id } = req.query;

      const targetComponent = await ctx.services.db.subjectComponent.findFirst({
        where: { id: comp_id?.toString(), subject: { studyBlock: { userId: ctx.userId } } },
        include: { subcomponents: true },
      });
      if (!targetComponent) return res.status(400);
      if (req.body.subcomponents) {
        const initupd = ctx.services.db.subjectComponent.update({
          where: {
            id: comp_id?.toString(),
          },
          data: {
            ...req.body,
            subcomponents: { deleteMany: [{ componentId: { not: "" } }] },
          },
        });
        const replacementSubcomponents = req.body.subcomponents.map((e: Partial<SubjectSubcomponent>) => {
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

        if (resultdata) return res.status(200).json(resultdata[1]);
        return res.status(500);
      } else if (req.body.subjectWeighting) {
        const initupd = ctx.services.db.subjectComponent.update({
          where: {
            id: comp_id?.toString(),
          },
          data: {
            ...req.body,
          },
        });
        const result = await ctx.services.db.$transaction([initupd]);
        return res.status(200).send({});
      } else if (req.body.name) {
        const initupd = await ctx.services.db.subjectComponent.update({
          where: {
            id: comp_id?.toString(),
          },
          data: {
            name: req.body.name,
          },
        });
        return res.status(200).send(initupd);
      }
      return res.status(400).send({});
    }
  }
);
