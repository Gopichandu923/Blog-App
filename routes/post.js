import express from "express";
import * as postController from "../controllers/post.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, postController.createPost);
router.get("/", postController.getAllPost);
router.get("/:id", postController.getPost);
router.put("/:id", protect, postController.updatePost);
router.delete("/:id", protect, postController.deletePost);
export default router;
