import { createDataTableCommandHelper, toast } from "@medusajs/ui";
import { sdk } from "../../lib/sdk";

const commandHelper = createDataTableCommandHelper();

export const useCommands = (refetch: () => void) => {
  return [
    commandHelper.command({
      label: "Approve",
      shortcut: "A",
      action: async (selection) => {
        const reviewsToApproveIds = Object.keys(selection);

        sdk.client
          .fetch("/admin/reviews/status", {
            method: "POST",
            body: {
              ids: reviewsToApproveIds,
              status: "approved",
            },
          })
          .then(() => {
            toast.success("Reviews approved");
            refetch();
          })
          .catch(() => {
            toast.error("Failed to approve reviews");
          });
      },
    }),
    commandHelper.command({
      label: "Reject",
      shortcut: "R",
      action: async (selection) => {
        const reviewsToRejectIds = Object.keys(selection);

        sdk.client
          .fetch("/admin/reviews/status", {
            method: "POST",
            body: {
              ids: reviewsToRejectIds,
              status: "rejected",
            },
          })
          .then(() => {
            toast.success("Reviews rejected");
            refetch();
          })
          .catch(() => {
            toast.error("Failed to reject reviews");
          });
      },
    }),
  ];
};
