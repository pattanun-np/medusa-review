import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { getReviewsWorkflow } from "../../../../workflows/review/getReviewsWorkflow";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { productId } = req.params;

  const { result } = await getReviewsWorkflow().run({
    input: {
      queryConfig: req.queryConfig,
      filters: {
        product_id: productId,
        status: "approved",
        parent: null,
      },
    },
  });

  res.json(result);
};
