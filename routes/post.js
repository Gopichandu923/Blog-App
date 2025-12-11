import express from "express";
import * as postController from "../controllers/post.js";
import { protect, authorizePostOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, postController.createPost);
router.get("/", postController.getAllPost);
router.get("/:id", postController.getPost);

router.put("/:id", protect, authorizePostOwner, postController.updatePost);
router.delete("/:id", protect, authorizePostOwner, postController.deletePost);
export default router;
