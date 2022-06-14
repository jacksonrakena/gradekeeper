// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../../lib/api/gkRoute";

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);

  const primsa = new PrismaClient();
  if (req.method === "POST") {
    const data = await primsa.studyBlock.create({
      data: {
        user: {
          connectOrCreate: {
            create: {
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
            where: { id: session.user?.email },
          },
        },
        ...req.body,
      },
    });
    if (data) return res.status(200).json(data);
    return res.status(404);
  }
});
