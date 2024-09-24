export type Boooks = {
  author: string;
  availableQuantity: 1;
  Borrow: Borrows[];
  code: string;
  title: string;
};

export interface Member {
  code: string;
  name: string;
  penaltyUntil?: string;
}

export type Borrows = {
  id: number;
  bookId: string;
  memberId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  member: Member;
};
