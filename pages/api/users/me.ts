// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { gkAuthorizedRoute } from "../../../lib/api/gkRoute";

export const getUserQuery = Prisma.validator<Prisma.UserArgs>()({
  select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
});

export const getUserInfo = async (db: PrismaClient, id: string) => {
  const data = await db.user.findUnique({
    where: { id: id },
    ...getUserQuery,
  });
  if (!data) {
    const data = await db.user.create({
      include: { studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
      data: {
        id: id,
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
    });
    return data;
  }
  return data;
};

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
    const primsa = new PrismaClient();
    if (req.method === "GET") {
      const data = await primsa.user.findUnique({
        where: { id: ctx.userId },
        ...getUserQuery,
      });
      if (!data) {
        const data = await primsa.user.create({
          data: {
            id: ctx.userId,
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
        });
        return res.status(200).json(data ?? {});
      }
      return res.status(200).json(data ?? {});
    }
    if (req.method === "DELETE") {
      await primsa.user.delete({
        where: { id: ctx.userId },
      });
      return res.status(200).json({});
    }
    if (req.method === "POST") {
      const updatedUser = await primsa.user.update({
        where: { id: ctx.userId },
        data: { ...req.body },
        include: { studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
      });
      return res.status(200).json(updatedUser);
    }
  }
);
