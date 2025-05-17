import { Button, ProgressAccordion, StatusBadge, Text } from "@medusajs/ui";
import { useState } from "react";
import { Link } from "react-router-dom";
import { statusColor } from "../utils/statusColor";
import { MediaViewer } from "./MediaViewer";
import { Review } from "./ReviewTable";

interface Props {
  review: Review;
  onAction?: (id: string, action: "approve" | "reject") => void;
}

const statusMap = {
  pending: "in-progress",
  approved: "completed",
  rejected: "completed",
} as const;

export const ReviewChild = ({ review, onAction }: Props) => {
  const color = statusColor(review.status);

  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  return (
    <>
      <ProgressAccordion.Item value={review.id} className="px-4">
        <ProgressAccordion.Header
          status={statusMap[review.status]}
          className="pl-0"
        >
          <div className="flex gap-2">
            <StatusBadge color={color}>
              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </StatusBadge>
            <p className="w-64 truncate">{review.title}</p>
          </div>
        </ProgressAccordion.Header>
        <ProgressAccordion.Content className="pl-16 pb-4">
          <div className="flex gap-2">
            <Text size="small" className="font-medium">
              {review.rating ? `Rating: ${review.rating}` : null}
            </Text>
            <Text size="small" className="text-ui-fg-muted">
              {new Date(review.created_at).toLocaleDateString("en-GB")}
            </Text>
          </div>
          <Link
            className="text-ui-fg-muted hover:text-ui-fg-on-color"
            to={review.customer_id ? `/customers/${review.customer_id}` : ""}
          >
            <span className="text-sm font-medium">User:</span>{" "}
            {review.is_admin
              ? "Admin"
              : review.customer?.first_name ?? review.customer_id}
          </Link>
          <div className="whitespace-pre-wrap my-2">{review.content}</div>

          {Boolean(review.medias?.length) && (
            <div className="flex gap-2 my-2">
              {review.medias?.map((media) => (
                <MediaViewer key={media.id} media={media} />
              ))}
            </div>
          )}

          {review.status === "pending" && (
            <div className="flex gap-2 justify-end mt-2">
              <Button
                variant="danger"
                disabled={selectedStatus === "rejected"}
                onClick={() => {
                  setSelectedStatus("rejected");
                  onAction?.(review.id, "reject");
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                disabled={selectedStatus === "approved"}
                onClick={() => {
                  setSelectedStatus("approved");
                  onAction?.(review.id, "approve");
                }}
              >
                Approve
              </Button>
            </div>
          )}
        </ProgressAccordion.Content>
      </ProgressAccordion.Item>
    </>
  );
};
