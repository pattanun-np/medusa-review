import { container, MedusaRequest, MedusaResponse } from "@medusajs/framework";
import ProductReviewModuleService from "../../../../../modules/product-review/service";
import { PRODUCT_REVIEW_MODULE } from "../../../../../modules/product-review";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { productId, users } = req.params;

  const reviewService = container.resolve<ProductReviewModuleService>(
    PRODUCT_REVIEW_MODULE
  );

  const customerService = container.resolve(Modules.CUSTOMER);

  const reviews = await reviewService.listReviews(
    {
      product_id: productId,
      customer_id: {
        $ne: null,
      },
    },
    {
      select: ["customer_id"],
    }
  );
  const customerIds = Array.from(
    new Set(reviews.map((review) => review.customer_id))
  ).filter((id): id is string => Boolean(id));

  const customers = await customerService.listCustomers(
    {
      id: customerIds,
    },
    {
      select: ["id", "first_name", "last_name"],
    }
  );

  res.json(customers);
};
