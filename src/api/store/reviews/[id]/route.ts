import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const {
    data: reviews,
    metadata: { count, take, skip } = {
      count: 0,
      take: 20,
      skip: 0,
    },
  } = await query.graph({
    entity: "review",
    ...req.queryConfig,
    fields: ["*", "product.*"],
    filters: {
      status: {
        $in: ["pending", "approved"],
      },
    },
  });

  res.json({
    reviews,
    count,
    limit: take,
    offset: skip,
  });
};
