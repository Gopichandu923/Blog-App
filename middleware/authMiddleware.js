import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../models/userModel.js";
import { getPostById } from "../models/postModel.js";
import { getCommentById } from "../models/commentModel.js";

dotenv.config();

//TO verify the user by using JWT token
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: 'Token format is "Bearer <token>".' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userExist = await findUserById(decoded.id);
    if (!userExist) {
      return res
        .status(401)
        .json({ message: "User associated with this token no longer exists." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired,Please sign in again." });
    }
    console.log(error);
    return res.status(500).json({ message: "Invalid token." });
  }
};

//  Post Authorization (PUT /posts/:id, DELETE /posts/:id)
export const authorizePostOwner = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const isPostAuthor = post.author_id === userId;
    if (!isPostAuthor) {
      if (req.method === "PUT")
        return res.status(403).json({
          message: "Post can only be modified by the post author.",
        });
      if (req.method === "DELETE")
        return res.status(403).json({
          message: "Post can only be delete by the post author.",
        });
    } else return next();
  } catch (error) {
    console.error("Authorization error for post deletion:", error);
    if (error.code === "22P02") {
      return res
        .status(404)
        .json({ message: "Post not found (Invalid ID format)." });
    }
    res
      .status(500)
      .json({ message: "Server error during authorization check." });
  }
};
//  Comment Update Authorization (PUT /comments/:id)
export const authorizeCommentOwner = async (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const comment = await getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    const isCommentOwner = comment.user_id === userId;
    if (!isCommentOwner) {
      return res.status(403).json({
        message: "Comment can only be modified by the comment owner.",
      });
    }
    return next();
  } catch (error) {
    console.error("Authorization error for comment deletion:", error);
    if (error.code === "22P02") {
      return res
        .status(404)
        .json({ message: "Comment not found (Invalid ID format)." });
    }
    res
      .status(500)
      .json({ message: "Server error during authorization check." });
  }
};

export const authorizeCommentDeletion = async (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const comment = await getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const postAuthorId = await getPostById(comment.post_id);

    const isCommentOwner = comment.author_id === userId;
    const isPostAuthor = postAuthorId.author_id === userId;
    if (isCommentOwner || isPostAuthor) {
      return next();
    } else {
      return res.status(403).json({
        message:
          "Comment can only be deleted by the comment owner or the post author.",
      });
    }
  } catch (error) {
    console.error("Authorization error for comment deletion:", error);
    if (error.code === "22P02") {
      return res
        .status(404)
        .json({ message: "Comment not found (Invalid ID format)." });
    }
    res
      .status(500)
      .json({ message: "Server error during authorization check." });
  }
};
