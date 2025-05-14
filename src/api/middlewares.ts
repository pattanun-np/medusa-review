import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { PostStoreReviewSchema } from "./store/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route";

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/store/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreReviewSchema),
      ],
    },
    {
      matcher: "/admin/reviews/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminUpdateReviewsStatusSchema),
      ],
    },
  ],
});
