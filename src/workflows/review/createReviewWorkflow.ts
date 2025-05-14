import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../modules/product-review";
import ProductReviewModuleService from "../../modules/product-review/service";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";

export type CreateReviewInput = {
  title?: string;
  content: string;
  rating: number;
  product_id: string;
  customer_id?: string;
  first_name: string;
  last_name: string;
  status?: "pending" | "approved" | "rejected";
};

const createReviewStep = createStep(
  "create-review",
  async (input: CreateReviewInput, { container }) => {
    // check valid product
    const productService = container.resolve(Modules.PRODUCT);
    const product = await productService.retrieveProduct(input.product_id);

    if (!product) {
      throw new Error("Product not found");
    }

    const reviewModuleService: ProductReviewModuleService = container.resolve(
      PRODUCT_REVIEW_MODULE
    );

    const review = await reviewModuleService.createReviews(input);

    return new StepResponse(review, review.id);
  },
  async (reviewId, { container }) => {
    if (!reviewId) {
      return;
    }

    const reviewModuleService: ProductReviewModuleService = container.resolve(
      PRODUCT_REVIEW_MODULE
    );

    await reviewModuleService.deleteReviews(reviewId);
  }
);

export const createReviewWorkflow = createWorkflow(
  "create-review",
  (input: CreateReviewInput) => {
    // Create the review
    const review = createReviewStep(input);

    return new WorkflowResponse({
      review,
    });
  }
);
