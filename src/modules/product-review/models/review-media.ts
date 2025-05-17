import { model } from "@medusajs/framework/utils";
import Review from "./review";

const ReviewMedia = model.define("review_media", {
  id: model.id().primaryKey(),
  fileId: model.text(),
  fileUrl: model.text(),
  mimeType: model.text(),
  review: model.belongsTo(() => Review, {
    mappedBy: "medias",
  }),
});

export default ReviewMedia;
