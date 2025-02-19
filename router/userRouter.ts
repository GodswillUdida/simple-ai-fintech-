import { Router } from "express";
import { getUser, signIn, signUp } from "../controller/userController";
import { signInSchema, signUpSchema } from "../Validation/validate";
import { validateSchema } from "../middleware/validateMiddleware";
import { loginLimiter } from "../src/server";


const router = Router();

router.post("/signup", validateSchema(signUpSchema), signUp);
router.post("/signin", loginLimiter, validateSchema(signInSchema), signIn);
router.get("/:id/get-user", getUser);

export default router;