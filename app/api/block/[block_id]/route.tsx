import { NextRequest, NextResponse } from "next/server";
import { AuthorizedRequestContext, gkAuthorizedRoute } from "../../../../lib/api/gkRoute";

const DELETE = gkAuthorizedRoute(async (req: NextRequest, ctx: AuthorizedRequestContext, { params }: { params: { block_id: string } }) => {
  if (!params.block_id) return NextResponse.json({ error: "Missing block_id" }, { status: 400 });
  const query = await ctx.services.db.studyBlock.findFirst({
    where: {
      id: params.block_id?.toString(),
      userId: ctx.userId,
    },
  });
  if (!query) return NextResponse.json({}, { status: 400 });

  await ctx.services.db.studyBlock.delete({
    where: {
      id: query.id,
    },
  });
  return NextResponse.json({});
});
export { DELETE };
