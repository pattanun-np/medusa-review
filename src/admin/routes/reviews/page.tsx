import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import {
  Button,
  DataTablePaginationState,
  DataTableRowSelectionState,
  Drawer,
  ProgressAccordion,
  Textarea,
  toast,
  useDataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";

import { ReviewChild } from "./components/ReviewChild";
import { Review, reviewColumns, ReviewTable } from "./components/ReviewTable";
import { useCommands } from "./useCommands";

type ReviewsResponse = {
  reviews: Review[];
  count: number;
  limit: number;
  offset: number;
};

const limit = 20;

const ReviewsPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {}
  );

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const pendingReplies = useMemo(() => {
    const ids =
      selectedReview?.children?.filter((child) => child.status === "pending") ??
      [];

    if (selectedReview?.status === "pending") {
      ids.push(selectedReview);
    }

    return ids;
  }, [selectedReview]);

  const [replyContent, setReplyContent] = useState("");

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reviews", offset, limit],
    queryFn: async () => {
      const { data } = await axios.get<ReviewsResponse>("/admin/reviews", {
        params: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          order: "-created_at",
        },
      });
      return data;
    },
  });

  const commands = useCommands(refetch);

  const table = useDataTable({
    commands,
    columns: reviewColumns,
    data: data?.reviews || [],
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    onRowClick: (_, row) => {
      // @ts-ignore (medusa bug)
      setSelectedReview(row.original as Review);
      setIsDrawerOpen(true);
    },
  });

  const [toBeSaved, setToBeSaved] = useState<Map<string, string>>(new Map());

  function handleAddToBeSaved(id: string, action: string) {
    setToBeSaved((prev) => {
      const newSet = new Map(prev);
      newSet.set(id, action);
      return newSet;
    });
  }

  async function handleSave() {
    const { approved, rejected } = Array.from(toBeSaved.entries()).reduce(
      (acc, [id, action]) => {
        if (action === "approve") {
          acc.approved.push(id);
        } else if (action === "reject") {
          acc.rejected.push(id);
        }
        return acc;
      },
      { approved: [] as string[], rejected: [] as string[] }
    );

    await Promise.all([
      axios.post("/admin/reviews/status", {
        ids: approved,
        status: "approved",
      }),
      axios.post("/admin/reviews/status", {
        ids: rejected,
        status: "rejected",
      }),
    ]);

    toast.success("Reviews saved", {
      description: `${approved.length} reviews approved, ${rejected.length} reviews rejected`,
    });

    setIsDrawerOpen(false);
    handleResetSelection();
    refetch();
  }

  async function handleReply() {
    await axios.post("/admin/reviews", {
      product_id: selectedReview?.product_id,
      parent_id: selectedReview?.id,
      title: "Reply from Admin",
      content: replyContent,
    });

    toast.success("Reply sent");
    refetch();
    setIsDrawerOpen(false);
    handleResetSelection();
  }

  function handleDrawerChange(open: boolean): void {
    setIsDrawerOpen(open);

    if (!open) {
      handleResetSelection();
    }
  }

  function handleResetSelection() {
    setSelectedReview(null);
    setToBeSaved(new Map());
    setReplyContent("");
  }

  return (
    <>
      <ReviewTable title="Reviews" table={table} />

      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerChange}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              Review for {selectedReview?.product?.title}
            </Drawer.Title>
            <Drawer.Description />
          </Drawer.Header>
          <Drawer.Body className="overflow-auto">
            <ProgressAccordion
              type="multiple"
              defaultValue={pendingReplies?.map((child) => child.id) || []}
            >
              {selectedReview && (
                <ReviewChild
                  key={selectedReview?.id}
                  review={selectedReview}
                  onAction={(id, action) => {
                    handleAddToBeSaved(id, action);
                  }}
                />
              )}
              {selectedReview?.children?.map((child) => (
                <ReviewChild
                  key={child.id}
                  review={child}
                  onAction={(id, action) => {
                    handleAddToBeSaved(id, action);
                  }}
                />
              ))}
            </ProgressAccordion>
          </Drawer.Body>
          <Drawer.Footer className="flex flex-col gap-2">
            <Button onClick={handleSave} disabled={toBeSaved.size <= 0}>
              {"Approve and Reject replies"}
            </Button>
            <Textarea
              className="w-[98%]"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button
              className="w-[98%]"
              onClick={handleReply}
              disabled={!replyContent}
            >
              {"Reply as Admin"}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  );
};

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubbleLeftRight,
});

export default ReviewsPage;
