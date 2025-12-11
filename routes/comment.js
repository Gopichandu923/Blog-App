import express from "express";
import * as commentController from "../controllers/comment.js";
import {
  protect,
  authorizeCommentOwner,
  authorizeCommentDeletion,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, commentController.createComment);
router.get("/{post_id}", protect, commentController.getAllComments);
router
  .route("/:id")
  .get(protect, commentController.getComment)
  .put(protect, authorizeCommentOwner, commentController.updateComment)
  .delete(protect, authorizeCommentDeletion, commentController.deleteComment);

export default router;
