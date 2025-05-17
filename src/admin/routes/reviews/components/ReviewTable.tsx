import { HttpTypes } from "@medusajs/framework/types";
import {
  Container,
  createDataTableColumnHelper,
  DataTable,
  Heading,
  StatusBadge,
  Toaster,
  UseDataTableReturn,
} from "@medusajs/ui";

import { Link } from "react-router-dom";
import { statusColor } from "../utils/statusColor";

export type ReviewMedia = {
  id: string;
  fileId: string;
  fileUrl: string;
  mimeType: string;
};

export type Review = {
  id: string;
  title?: string;
  content: string;
  rating: number;
  product_id: string;
  customer_id?: string;
  is_admin?: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
  updated_at: Date;
  product?: HttpTypes.AdminProduct;
  customer?: HttpTypes.AdminCustomer;
  parent_id?: string;
  children?: Review[];
  medias?: ReviewMedia[];
};

const columnHelper = createDataTableColumnHelper<Review>();

export const reviewColumns = [
  columnHelper.select(),
  columnHelper.accessor("product", {
    header: "Product",
    id: "product",
    cell: ({ row }) => {
      return (
        <Link to={`/products/${row.original.product_id}`}>
          {row.original.product?.title}
        </Link>
      );
    },
  }),
  columnHelper.accessor("children", {
    header: "Pending Replies",
    id: "pending-replies",
    cell: ({ row }) => {
      return (
        <>
          {row.original.children?.filter((r) => r.status === "pending")
            .length || 0}{" "}
          Replies
        </>
      );
    },
  }),
  columnHelper.accessor("children", {
    header: "Replies",
    id: "replies",
    cell: ({ row }) => {
      return <>{row.original.children?.length || 0} Replies</>;
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    id: "status",
    cell: ({ row }) => {
      return (
        <StatusBadge color={statusColor(row.original.status)}>
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </StatusBadge>
      );
    },
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
    id: "rating",
  }),
  columnHelper.accessor("title", {
    header: "Title",
    id: "title",
    maxSize: 150,
    cell: ({ row }) => {
      return <div className="truncate">{row.original.title}</div>;
    },
  }),
  columnHelper.accessor("content", {
    header: "Content",
    id: "content",
    maxSize: 200,
    cell: ({ row }) => {
      return <div className="truncate">{row.original.content}</div>;
    },
  }),
];

interface Props {
  title: string;
  table: UseDataTableReturn<Review>;
}

export const ReviewTable = ({ title, table }: Props) => {
  return (
    <Container>
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>{title}</Heading>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
        <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
      </DataTable>
      <Toaster />
    </Container>
  );
};
