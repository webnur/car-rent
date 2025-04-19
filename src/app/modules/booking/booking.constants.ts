export const bookingSearchableFields = ["paymentStatus", "paymentType"];
export const bookingFilterableFields = [
  "searchTerm",
  "paymentStatus",
  "paymentType",
];

export const paymentStatus = [
  "pending",
  "partial",
  "paid",
  "cancelled",
] as const;
export const paymentType = ["full", "partial", "free"] as const;
