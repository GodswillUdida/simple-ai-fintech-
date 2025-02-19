import { Router } from "express";
import { signInSchema, signUpSchema } from "../Validation/validate";
import { validateSchema } from "../middleware/validateMiddleware";
import { loginLimiter } from "../middleware/loginLimiter";
import { deleteAllUsers, getAllUsers, getUser, signIn, signUp } from "../controller/userController";


const router = Router();

router.post("/signup", validateSchema(signUpSchema), signUp);
router.post("/signin", loginLimiter,validateSchema(signInSchema), signIn);
router.get("/:id/get-user", getUser);
router.delete("/delete-all",deleteAllUsers);
router.get("/get-all", getAllUsers);

export default router;