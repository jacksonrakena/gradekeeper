// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { gkAuthorizedRoute } from "../../../lib/api/gkRoute";

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
      const data = await ctx.services.db.studyBlock.create({
        data: {
          userId: ctx.userId,
          ...req.body,
        },
      });
      if (data) return res.status(200).json(data);
      return res.status(404);
    }
  }
);
