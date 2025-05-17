import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { getReviewsWorkflow } from "../../../workflows/review/getReviewsWorkflow";
import { createReviewWorkflow } from "../../../workflows/review/createReviewWorkflow";
import { PostStoreReviewReq } from "../../store/reviews/route";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await getReviewsWorkflow().run({
    input: {
      queryConfig: req.queryConfig,
      filters: {
        parent: null,
      },
    },
  });

  res.json(result);
};

export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreReviewReq>,
  res: MedusaResponse
) => {
  /**
   * user = Core user (admin)
   * customer = Medusa customer
   */
  const isAdmin = req.auth_context?.actor_type === "user";

  const { result } = await createReviewWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      is_admin: isAdmin,
      status: "approved",
      medias: [],
    },
  });

  res.json(result);
};
