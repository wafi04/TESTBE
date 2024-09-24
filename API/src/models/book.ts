import { Book } from "@prisma/client";

export interface BookWithAvailability extends Book {
  availableQuantity: number;
}
