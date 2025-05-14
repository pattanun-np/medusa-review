import { defineRouteConfig } from "@medusajs/admin-sdk";
import { HttpTypes } from "@medusajs/framework/types";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import {
  Container,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  DataTableRowSelectionState,
  Heading,
  StatusBadge,
  Toaster,
  useDataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sdk } from "../../lib/sdk";

import { useCommands } from "./useCommands";

type Review = {
  id: string;
  title?: string;
  content: string;
  rating: number;
  product_id: string;
  customer_id?: string;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
  updated_at: Date;
  product?: HttpTypes.AdminProduct;
  customer?: HttpTypes.AdminCustomer;
};

const columnHelper = createDataTableColumnHelper<Review>();

const columns = [
  columnHelper.select(),

  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
  }),
  columnHelper.accessor("content", {
    header: "Content",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const color =
        row.original.status === "approved"
          ? "green"
          : row.original.status === "rejected"
          ? "red"
          : "grey";
      return (
        <StatusBadge color={color}>
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </StatusBadge>
      );
    },
  }),
  columnHelper.accessor("product", {
    header: "Product",
    cell: ({ row }) => {
      return (
        <Link to={`/products/${row.original.product_id}`}>
          {row.original.product?.title}
        </Link>
      );
    },
  }),
];

const limit = 15;

const ReviewsPage = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {}
  );

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading, refetch } = useQuery<{
    reviews: Review[];
    count: number;
    limit: number;
    offset: number;
  }>({
    queryKey: ["reviews", offset, limit],
    queryFn: () =>
      sdk.client.fetch("/admin/reviews", {
        query: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          order: "-created_at",
        },
      }),
  });

  const commands = useCommands(refetch);

  const table = useDataTable({
    commands,
    columns,
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
  });

  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Reviews</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
        <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
      </DataTable>
      <Toaster />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Reviews",
  icon: ChatBubbleLeftRight,
});

export default ReviewsPage;
