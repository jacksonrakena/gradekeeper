// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { gkAuthorizedRoute } from "../../lib/api/gkRoute";

export const getUserQuery = Prisma.validator<Prisma.UserArgs>()({
  select: { gradeMap: true, studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
});

export default gkAuthorizedRoute(async (req: NextApiRequest, res: NextApiResponse<object>, userEmail: string) => {
  const primsa = new PrismaClient();
  if (req.method === "GET") {
    const data = await primsa.user.findUnique({
      where: { id: userEmail },
      ...getUserQuery,
    });
    if (!data) {
      const data = await primsa.user.create({
        data: {
          id: userEmail,
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
    var users = await primsa.user.findMany({
      include: { studyBlocks: { include: { subjects: { include: { components: { include: { subcomponents: true } } } } } } },
    });
    // for (var u = 0; u < users.length; u++) {
    //   let data = users[u];
    //   for (var i = 0; i < data.studyBlocks.length; i++) {
    //     for (var s = 0; s < data.studyBlocks[i].subjects.length; s++) {
    //       for (var c = 0; c < data.studyBlocks[i].subjects[s].components.length; c++) {
    //         const component = data.studyBlocks[i].subjects[s].components[c];
    //         if (
    //           (!component.subcomponents || component.subcomponents.length === 0) &&
    //           component.subcomponentsArray &&
    //           component.subcomponentsArray.length !== 0
    //         ) {
    //           const subarr = component.subcomponentsArray as Prisma.JsonArray;
    //           try {
    //             await primsa.$transaction([
    //               primsa.subjectSubcomponent.createMany({
    //                 data: subarr.map((e) => ({ ...e, componentId: component.id })),
    //               }),
    //               primsa.subjectComponent.update({
    //                 where: {
    //                   id: component.id,
    //                 },
    //                 data: {
    //                   subcomponentsArray: undefined,
    //                 },
    //               }),
    //             ]);
    //           } catch (e) {
    //             console.log("exception for " + data.id);
    //             console.log(e);
    //           }
    //           component.subcomponents = subarr;
    //         }
    //         component.subcomponentsArray = undefined;
    //       }
    //     }
    //   }
    // }
    return res.status(200).json(data ?? {});
  }
  if (req.method === "DELETE") {
    await primsa.user.delete({
      where: { id: userEmail },
    });
    return res.status(200).json({});
  }
});
