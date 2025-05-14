import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

export type UpdateReviewInput = {
  id: string;
  status: "pending" | "approved" | "rejected";
}[];

import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../modules/product-review";
import ProductReviewModuleService from "../../modules/product-review/service";

export type UpdateReviewsStepInput = {
  id: string;
  status: "pending" | "approved" | "rejected";
}[];

const updateReviewsStep = createStep(
  "update-review-step",
  async (input: UpdateReviewsStepInput, { container }) => {
    const reviewModuleService: ProductReviewModuleService = container.resolve(
      PRODUCT_REVIEW_MODULE
    );

    // Get original review before update
    const originalReviews = await reviewModuleService.listReviews({
      id: input.map((review) => review.id),
    });

    const reviews = await reviewModuleService.updateReviews(input);

    return new StepResponse(reviews, originalReviews);
  },
  async (originalData, { container }) => {
    if (!originalData) {
      return;
    }

    const reviewModuleService: ProductReviewModuleService = container.resolve(
      PRODUCT_REVIEW_MODULE
    );

    // Restore original review status
    await reviewModuleService.updateReviews(originalData);
  }
);

export const updateReviewWorkflow = createWorkflow(
  "update-review",
  (input: UpdateReviewInput) => {
    const reviews = updateReviewsStep(input);

    return new WorkflowResponse({
      reviews,
    });
  }
);
