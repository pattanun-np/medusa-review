import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { PostStoreReviewSchema } from "./store/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/store/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        upload.array("files"),
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
    {
      matcher: "/store/reviews/upload",
      method: "POST",
      middlewares: [upload.array("files")],
    },
  ],
});
