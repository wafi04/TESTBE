import { Request, Response } from "express";
import * as borrowService from "../service/BorrowService";
import { ApplicationError } from "../utils/Error";

export const borrowBook = async (req: Request, res: Response) => {
  const { memberId, bookId } = req.body;
  try {
    const result = await borrowService.borrowBook(memberId, bookId);
    res.json(result);
  } catch (error) {
    console.error("Error in borrowBook:", error);
    if (error instanceof ApplicationError) {
      res.status(error.statusCode || 400).json({ error: error.message });
    } else {
      res.status(500).json({
        error: "An unexpected error occurred while borrowing the book",
      });
    }
  }
};
export const borrowsByMembers = async (req: Request, res: Response) => {
  const { memberId } = req.params;
  try {
    const result = await borrowService.GetBookByMemberId(memberId);
    res.json(result);
  } catch (error) {
    console.error("Error in borrowBook:", error);
    if (error instanceof ApplicationError) {
      res.status(error.statusCode || 400).json({ error: error.message });
    } else {
      res.status(500).json({
        error: "An unexpected error occurred while borrowing the book",
      });
    }
  }
};

export const returnBook = async (req: Request, res: Response) => {
  const { borrowId } = req.body;
  try {
    const result = await borrowService.ReturnBook(borrowId);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while returning the book" });
  }
};
