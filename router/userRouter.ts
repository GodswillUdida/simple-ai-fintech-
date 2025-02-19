import { Router } from "express";
import { signInSchema, signUpSchema } from "../Validation/validate";
import { validateSchema } from "../middleware/validateMiddleware";
import { loginLimiter } from "../middleware/loginLimiter";
import { deleteAllUsers, getAllUsers, getUser, signIn, signUp } from "../controller/userController";


const router = Router();

router.post("/signup", validateSchema(signUpSchema), signUp);
router.post("/signin", loginLimiter,validateSchema(signInSchema), signIn);
router.route("/:id/get-user").get(getUser);
router.route("/delete-all").delete(deleteAllUsers);
router.route("/get-all").get(getAllUsers);

export default router;
