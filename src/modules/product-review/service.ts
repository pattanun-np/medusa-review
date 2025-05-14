import { MedusaService } from "@medusajs/framework/utils";
import Review from "./models/review";
import ReviewMedia from "./models/review-media";

class ProductReviewModuleService extends MedusaService({
  Review,
  ReviewMedia,
}) {}

export default ProductReviewModuleService;
