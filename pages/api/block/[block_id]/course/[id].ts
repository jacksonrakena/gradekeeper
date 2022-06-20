// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { gkRoute } from "../../../../../lib/api/gkRoute";

export default gkRoute(async (req: NextApiRequest, res: NextApiResponse<object>) => {
  const session = await getSession({ req });
  if (!session || !session.user?.email) return res.status(400);

  const primsa = new PrismaClient();
  if (req.method === "GET") {
    const data = await primsa.subject.findFirst({
      where: {
        id: req.query.id.toString(),
        studyBlock: { userId: session.user.email },
      },
      include: {
        components: { include: { subcomponents: true } },
        studyBlock: { select: { name: true, user: { select: { gradeMap: true } } } },
      },
    });
    const otherSubjects = await primsa.subject.findMany({
      where: { studyBlock: { userId: session.user.email } },
      include: { studyBlock: true },
    });
    if (data) return res.status(200).json({ ...data, otherSubjects: otherSubjects });
    return res.status(404);
  }
  if (req.method === "DELETE") {
    const query = await primsa.subject.findFirst({
      where: {
        id: req.query.id.toString(),
        studyBlock: { userId: session.user.email },
      }
    });
    if (!query) return res.status(400).json({});
    await primsa.subject.delete({
      where: {
        id: query.id,
      },
    });
    return res.status(200).json({});
  }
});
