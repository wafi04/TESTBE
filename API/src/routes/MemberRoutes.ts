import express from "express";
import * as memberController from "../controllers/MemberControllers";

const router = express.Router();

router.get("/", memberController.getMembers);

export default router;
