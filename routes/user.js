import express from "express";
import * as UserController from "../controllers/user.js";

const router = express.Router();

router.post("/signin", UserController.signIn);
router.post("/signup", UserController.signUp);

export default router;
