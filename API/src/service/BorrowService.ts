import prisma from "../config/prisma";
import { ApplicationError } from "../utils/Error";

export const borrowBook = async (memberId: string, bookId: string) => {
  const member = await prisma.member.findUnique({
    where: { code: memberId },
    include: { Borrow: { where: { returnedAt: null } } },
  });

  if (!member) {
    throw new ApplicationError("Member not found", 404);
  }

  if (member.penaltyUntil && member.penaltyUntil > new Date()) {
    throw new ApplicationError("Member is currently penalized", 403);
  }

  if (member.Borrow.length >= 2) {
    throw new ApplicationError("Member has already borrowed 2 books", 403);
  }

  const book = await prisma.book.findUnique({
    where: { code: bookId },
    include: { Borrow: { where: { returnedAt: null } } },
  });

  if (!book) {
    throw new ApplicationError("Book not found", 404);
  }

  if (book.Borrow.length >= book.stock) {
    throw new ApplicationError("All copies of this book are borrowed", 403);
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  return prisma.borrow.create({
    data: {
      bookId,
      memberId,
      dueDate,
    },
  });
};

export const GetBookByMemberId = async (memberId: string) => {
  try {
    const member = await prisma.member.findUnique({
      where: { code: memberId },
      include: {
        Borrow: {
          where: { returnedAt: null },
          include: {
            book: {
              select: {
                code: true,
                title: true,
                author: true,
              },
            },
          },
        },
      },
    });

    if (!member) {
      throw new ApplicationError("Member not found", 404);
    }

    const borrowedBooks = member.Borrow.map((borrow) => ({
      borrowId: borrow.id,
      bookCode: borrow.book.code,
      title: borrow.book.title,
      author: borrow.book.author,
      borrowedAt: borrow.borrowedAt,
      dueDate: borrow.dueDate,
    }));

    return borrowedBooks;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError(
      "An error occurred while fetching borrowed books",
      500
    );
  }
};

export const ReturnBook = async (borrowId: number) => {
  const borrow = await prisma.borrow.findUnique({
    where: { id: borrowId },
    include: { member: true },
  });

  if (!borrow) {
    throw new ApplicationError("Borrow record not found", 403);
  }

  if (borrow.returnedAt) {
    throw new ApplicationError("Book already returned", 403);
  }

  const returnDate = new Date();
  const isLate = returnDate > borrow.dueDate;

  let penaltyUntil = null;
  if (isLate) {
    penaltyUntil = new Date(returnDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  }

  await prisma.borrow.update({
    where: { id: borrowId },
    data: { returnedAt: returnDate },
  });

  if (penaltyUntil) {
    await prisma.member.update({
      where: { code: borrow.memberId },
      data: { penaltyUntil },
    });
  }

  const borrowDuration = returnDate.getTime() - borrow.borrowedAt.getTime();

  return {
    message: "Book returned successfully",
    returnedAt: returnDate,
    penaltyUntil: penaltyUntil,
    borrowDurationDays: Math.floor(borrowDuration / (1000 * 60 * 60 * 24)),
    isLate: isLate,
    penaltyDurationDays: isLate ? 3 : 0,
  };
};
