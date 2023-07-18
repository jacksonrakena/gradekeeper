// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { gkAuthorizedRoute } from "../../../../../lib/api/gkRoute";

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
    if (req.method === "GET") {
      const data = await ctx.services.db.subject.findFirst({
        where: {
          id: req.query.id?.toString(),
          studyBlock: { userId: ctx.userId },
        },
        include: {
          components: { include: { subcomponents: true } },
          studyBlock: { select: { name: true, user: { select: { gradeMap: true } } } },
        },
      });
      const otherSubjects = await ctx.services.db.subject.findMany({
        where: { studyBlock: { userId: ctx.userId } },
        include: { studyBlock: true },
      });
      if (data) return res.status(200).json({ ...data, otherSubjects: otherSubjects });
      return res.status(404);
    }
    if (req.method === "POST") {
      const toupdate = await ctx.services.db.subject.findFirst({
        where: {
          id: req.query.id?.toString(),
          studyBlock: { userId: ctx.userId },
        },
      });
      if (!toupdate) return res.status(404).json({});
      const updated = await ctx.services.db.subject.update({
        where: {
          id: toupdate.id,
        },
        data: { ...req.body },
        include: { components: { include: { subcomponents: true } } },
      });
      return res.status(200).json(updated);
    }
  }
);
