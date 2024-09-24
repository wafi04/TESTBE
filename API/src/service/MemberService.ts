import prisma from "../config/prisma";
import { MemberWithBorrowCount } from "../models/member.model";

export const getAllMembers = async (): Promise<MemberWithBorrowCount[]> => {
  const members = await prisma.member.findMany({
    include: {
      Borrow: {
        where: { returnedAt: null },
      },
    },
  });

  return members.map((member) => ({
    ...member,
    borrowedBooks: member.Borrow.length,
  }));
};
