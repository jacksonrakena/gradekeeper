// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkAuthorizedRoute, gkRoute } from "../../../lib/api/gkRoute";

export default gkAuthorizedRoute(async (req: NextApiRequest, res: NextApiResponse<object>, userEmail: string) => {
  const primsa = new PrismaClient();
  if (req.method === "POST") {
    const data = await primsa.studyBlock.create({
      data: {
        userId: userEmail,
        ...req.body,
      },
    });
    if (data) return res.status(200).json(data);
    return res.status(404);
  }
});
