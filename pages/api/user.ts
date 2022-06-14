// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../lib/api/gkRoute";

export const getUserQuery = Prisma.validator<Prisma.UserArgs>()({
  select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
});

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);

  const primsa = new PrismaClient();
  if (req.method === "GET") {
    const data = await primsa.user.findUnique({
      where: { id: session.user.email },
      select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
    });
    return res.status(200).json(data ?? {});
  } else if (req.method === "POST") {
    if (req.body.data.user_id !== session.user?.email) return res.status(400).json({ error: "cannot update another user" });
    return res.status(200).json(req.body.data);
  }
});
