import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../../lib/api/gkRoute";

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);

  const primsa = new PrismaClient();
  if (req.method === "GET") {
    const data = await primsa.studyBlock.findFirst({
      where: {
        id: req.query.block_id.toString(),
        userId: session.user.email,
      },
    });
    if (data) return res.status(200).json(data);
    return res.status(404);
  } else if (req.method === "DELETE") {
    const query = await primsa.studyBlock.findFirst({
      where: {
        id: req.query.block_id.toString(),
        userId: session.user?.email,
      },
    });
    if (!query) return res.status(400).send({});
    await primsa.studyBlock.delete({
      where: {
        id: query.id,
      },
    });
    return res.status(200).send({});
  }
});
