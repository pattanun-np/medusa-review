import { Button, clx, FocusModal } from "@medusajs/ui";
import { useState } from "react";
import { ReviewMedia } from "./ReviewTable";

interface Props {
  media: ReviewMedia;
  className?: string;
}

const mimeTypes = ["image", "video"] as const;

export const MediaViewer = ({ media, className }: Props) => {
  const [open, setOpen] = useState(false);

  const mimeType = media.mimeType.split("/")[0];

  if (!mimeTypes.includes(mimeType as (typeof mimeTypes)[number])) {
    return null;
  }

  return (
    <>
      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Trigger>
          <div className={clx("w-24 h-24", className)}>
            {mimeType === "image" && (
              <Button
                variant="secondary"
                className="p-0 w-full h-full object-contain"
                onClick={() => setOpen(true)}
              >
                <img src={media.fileUrl} alt="an image" />
              </Button>
            )}
            {mimeType === "video" && (
              <Button
                variant="secondary"
                className="p-0 w-full h-full"
                onClick={() => setOpen(true)}
              >
                Watch Video
              </Button>
            )}
          </div>
        </FocusModal.Trigger>
        <FocusModal.Content className="w-[80vw] h-[80vh] mx-auto my-auto">
          <FocusModal.Header>
            <FocusModal.Title>{media.fileId}</FocusModal.Title>
            <FocusModal.Close />
          </FocusModal.Header>
          <FocusModal.Body className="flex items-center justify-center">
            {mimeType === "image" && <img src={media.fileUrl} alt="an image" />}
            {mimeType === "video" && <video src={media.fileUrl} controls />}
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </>
  );
};
