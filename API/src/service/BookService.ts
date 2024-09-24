import prisma from "../config/prisma";
import { BookWithAvailability } from "../models/book";

export const getAllBooks = async (): Promise<BookWithAvailability[]> => {
  const books = await prisma.book.findMany({
    include: {
      Borrow: {
        where: { returnedAt: null },
        include: {
          member: true,
        },
      },
    },
  });

  return books.map((book) => ({
    ...book,
    availableQuantity: book.stock - book.Borrow.length, // Menghitung jumlah buku yang tersedia
  }));
};
