import {
  defineMiddlewares,
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http";
import { PostStoreReviewSchema } from "./store/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/route";
import multer from "multer";
import { GetReviewsSchema } from "../workflows/review/getReviewsWorkflow";

const upload = multer({ storage: multer.memoryStorage() });

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/admin/reviews",
      middlewares: [
        authenticate("user", ["session", "bearer"]),
        // @ts-ignore
        upload.array("files"),
        validateAndTransformBody(PostStoreReviewSchema),
      ],
    },
    {
      method: ["POST"],
      matcher: "/store/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        // @ts-ignore
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
      method: ["GET"],
      matcher: "/admin/reviews",
      middlewares: [
        validateAndTransformQuery(GetReviewsSchema, {
          defaults: [
            "*",
            "product.title",
            "product.id",
            "medias.*",
            "children.*",
            "children.medias.*",
          ],
          isList: true,
        }),
      ],
    },
    {
      method: ["GET"],
      matcher: "/store/reviews/:productId",
      middlewares: [
        validateAndTransformQuery(GetReviewsSchema, {
          defaults: [
            "*",
            "product.title",
            "product.id",
            "medias.*",
            "children.*",
            "children.medias.*",
          ],
          isList: true,
        }),
      ],
    },
  ],
});
