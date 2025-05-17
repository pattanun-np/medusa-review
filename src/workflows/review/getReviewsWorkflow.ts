import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import { container, MedusaRequest } from "@medusajs/framework";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

export const GetReviewsSchema = createFindParams({
  order: "-created_at",
});

type GetReviewsInput = {
  queryConfig?: MedusaRequest["queryConfig"];
  filters?: {
    product_id?: string;
    status?: "pending" | "approved" | "rejected";
    parent?: string | null;
  };
};

const getReviewsStep = createStep(
  "get-reviews-step",
  async (input: GetReviewsInput) => {
    const query = container.resolve("query");

    const {
      data: reviews,
      metadata: { count, take, skip } = {
        count: 0,
        take: 20,
        skip: 0,
      },
    } = await query.graph({
      entity: "review",
      ...input.queryConfig,
      fields: [
        "*",
        "product.title",
        "product.id",
        "medias.*",
        "children.*",
        "children.medias.*",
      ],
      filters: input.filters,
    });

    const reviewWithSortedChildren = reviews.map((review) => {
      return {
        ...review,
        children: review.children?.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      };
    });

    return new StepResponse({
      reviews: reviewWithSortedChildren,
      count,
      limit: take,
      offset: skip,
    });
  }
);

export const getReviewsWorkflow = createWorkflow(
  "get-reviews",
  (input: GetReviewsInput) => {
    const reviews = getReviewsStep(input);

    return new WorkflowResponse(reviews);
  }
);
