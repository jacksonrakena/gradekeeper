// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../../lib/api/gkRoute";
import { database } from "../../../lib/mgTypes";

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);

  const primsa = new PrismaClient();
  if (req.method === "POST") {
    const data = await primsa.studyBlock.create({
      data: {
        userId: session.user?.email,
        ...req.body,
      },
    });
    if (data) return res.status(200).json(data);
    return res.status(404);
  }
});
