import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
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
    if (!req.query.block_id) return res.status(400).json({ error: "Missing block_id" });
    if (req.method === "GET") {
      const data = await ctx.services.db.studyBlock.findFirst({
        where: {
          id: req.query.block_id?.toString(),
          userId: ctx.userId,
        },
      });
      if (data) return res.status(200).json(data);
      return res.status(404);
    } else if (req.method === "DELETE") {
      const query = await ctx.services.db.studyBlock.findFirst({
        where: {
          id: req.query.block_id?.toString(),
          userId: ctx.userId,
        },
      });
      if (!query) return res.status(400).send({});
      await ctx.services.db.studyBlock.delete({
        where: {
          id: query.id,
        },
      });
      return res.status(200).send({});
    }
  }
);
