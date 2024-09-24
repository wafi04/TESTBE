import { Request, Response } from "express";
import * as bookService from "../service/BookService";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books" });
  }
};
