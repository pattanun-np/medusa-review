import { MedusaError, Modules } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PRODUCT_REVIEW_MODULE } from "../../modules/product-review";
import ProductReviewModuleService from "../../modules/product-review/service";

export type CreateReviewInput = {
  parent_id?: string;
  title?: string;
  content: string;
  rating?: number;
  product_id: string;
  customer_id?: string;
  is_admin?: boolean;
  status?: "pending" | "approved" | "rejected";
  medias: {
    fileId: string;
    mimeType: string;
    fileUrl: string;
  }[];
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

    const { medias, ...reviewData } = input;

    if (!reviewData.parent_id && !reviewData.rating) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "if it's a review, rating is required or if it's a reply, parent_id is required"
      );
    }

    if (reviewData.parent_id) {
      // auto throw error if parent review not found
      const parentReview = await reviewModuleService.retrieveReview(
        reviewData.parent_id
      );

      if (parentReview.product_id !== reviewData.product_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Parent review and review must be for the same product"
        );
      }

      if (parentReview.parent_id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Max depth of replies is 1"
        );
      }
    }

    const review = await reviewModuleService.createReviews(reviewData);
    try {
      await reviewModuleService.createReviewMedias(
        medias.map((media) => ({
          review_id: review.id,
          fileUrl: media.fileUrl,
          fileId: media.fileId,
          mimeType: media.mimeType,
        }))
      );

      return new StepResponse(review, review.id);
    } catch (error) {
      await reviewModuleService.deleteReviewMedias(
        medias.map((media) => media.fileId)
      );

      if (review.id) {
        await reviewModuleService.deleteReviews(review.id);
      }

      throw error;
    }
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
