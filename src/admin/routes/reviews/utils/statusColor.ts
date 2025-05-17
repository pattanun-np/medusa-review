export const statusColor = (status: string) =>
  status === "approved" ? "green" : status === "rejected" ? "red" : "grey";
