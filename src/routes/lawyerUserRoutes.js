import { Router } from "express";
import {
  create_lawyer_user,
  login_lawyer,
} from "../controllers/lawyerUserController.js";
const router = Router();

router.post("/create", create_lawyer_user);

router.post("/login", login_lawyer);

export default router;
