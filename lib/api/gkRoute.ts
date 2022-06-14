import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export function gkRoute<T>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>) => any
): (req: NextApiRequest, res: NextApiResponse<T>) => any {
  return withSentry(handler);
}
