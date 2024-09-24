import express from "express";
import * as bookController from "../controllers/BookController";

const router = express.Router();

router.get("/", bookController.getBooks);

export default router;
