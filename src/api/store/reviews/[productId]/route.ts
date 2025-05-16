import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetReviewsSchema = createFindParams({
  order: "-created_at"
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query");

  const { productId } = req.params;

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
    fields: [
      "*",
      "product.title",
      "product.id",
      "medias.*",
      "children.*",
      "children.medias.*",
    ],
    filters: {
      product_id: productId,
      status: "approved",
      parent: null,
    },
  });

  res.json({
    reviews,
    count,
    limit: take,
    offset: skip,
  });
};
