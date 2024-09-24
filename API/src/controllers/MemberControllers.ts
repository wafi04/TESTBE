import { Request, Response } from "express";
import * as memberService from "../service/MemberService";

export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await memberService.getAllMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching members" });
  }
};
