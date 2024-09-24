import express from "express";
import * as borrowController from "../controllers/BorrowController";

const router = express.Router();

router.post("/borrow", borrowController.borrowBook);
router.get("/borrow/:memberId", borrowController.borrowsByMembers);
router.post("/return", borrowController.returnBook);

export default router;
