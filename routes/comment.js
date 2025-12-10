import express from "express";
import * as commentController from "../controllers/comment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, commentController.createComment);
router.get("/{post_id}", protect, commentController.getAllComments);
export default router;
