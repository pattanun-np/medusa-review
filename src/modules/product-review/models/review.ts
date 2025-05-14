import { model } from "@medusajs/framework/utils";
import ReviewMedia from "./review-media";

const Review = model
  .define("review", {
    id: model.id().primaryKey(),
    title: model.text().nullable(),
    content: model.text(),
    rating: model.float(),
    status: model.enum(["pending", "approved", "rejected"]).default("pending"),
    product_id: model.text().index("IDX_REVIEW_PRODUCT_ID"),
    customer_id: model.text().nullable(),
    medias: model.hasMany(() => ReviewMedia, {
      mappedBy: "review",
    }),
  })
  .cascades({
    delete: ["medias"],
  })
  .checks([
    {
      name: "rating_range",
      expression: (columns) =>
        `${columns.rating} >= 1 AND ${columns.rating} <= 5`,
    },
  ]);

export default Review;
