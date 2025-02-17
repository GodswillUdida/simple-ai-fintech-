import { Router } from "express";
import { signIn, signUp } from "../controller/userController";


const router = Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

export default router;