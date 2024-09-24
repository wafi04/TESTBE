import { Member } from "@prisma/client";

export interface MemberWithBorrowCount extends Member {
  borrowedBooks: number;
}
