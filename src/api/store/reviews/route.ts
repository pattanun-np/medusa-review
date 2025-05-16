import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";

import { z } from "zod";
import { createReviewWorkflow } from "../../../workflows/review/createReviewWorkflow";
import { MedusaError } from "@medusajs/framework/utils";
import {
  deleteFilesWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows";

export const PostStoreReviewSchema = z.object({
  parent_id: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  rating: z.preprocess((val) => {
    if (val && typeof val === "string") {
      return parseInt(val);
    }
    return val;
  }, z.number().min(1).max(5).optional()),
  product_id: z.string(),
});

type PostStoreReviewReq = z.infer<typeof PostStoreReviewSchema>;

export const POST = async (
  req: AuthenticatedMedusaRequest<PostStoreReviewReq>,
  res: MedusaResponse
) => {
  const input = req.body;
  const inputFiles = req.files as Express.Multer.File[];

  const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: inputFiles?.map((f) => ({
        filename: f.originalname,
        mimeType: f.mimetype,
        content: f.buffer.toString("binary"),
        access: "public",
      })),
    },
  });

  const medias = uploadedFiles.map((file, index) => ({
    fileId: file.id,
    mimeType: inputFiles.at(index)?.mimetype ?? "",
  }));

  try {
    const { result: review } = await createReviewWorkflow(req.scope).run({
      input: {
        ...input,
        customer_id: req.auth_context?.actor_id,
        medias,
      },
    });

    res.json(review);
  } catch (error) {
    deleteFilesWorkflow(req.scope).run({
      input: {
        ids: uploadedFiles.map((file) => file.id),
      },
    });
    throw error;
  }
};
