import * as CommentModel from "../models/commentModel.js";
import * as PostModel from "../models/postModel.js";

//POST method for creating comment for a post

export const createComment = async (req, res) => {
  const { post_id, content } = req.body;
  const user = req.user;
  if (!post_id || !content) {
    return res
      .status(400)
      .json({ message: "Please provide post_id and content." });
  }
  try {
    const newComment = await CommentModel.createComment(
      post_id,
      content,
      user.id
    );
    if (!newComment) {
      return res
        .status(400)
        .json({ message: "Please provide correct post id." });
    }
    return res
      .status(201)
      .json({ message: "Successfully added the comment.", newComment });
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(400).json({ message: "Provide a valid post id." });
    }
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "Post doesn't exist with post id." });
    }
    return res
      .status(500)
      .json({ message: "Internal server error while creating a comment." });
  }
};

//GET method to get all comments of a post
export const getAllComments = async (req, res) => {
  const { post_id } = req.query;
  if (!post_id) {
    return res.status(400).json({ message: "Please provide post id." });
  }
  try {
    const post = await PostModel.getPostById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await CommentModel.getAllComments(post_id);
    return res.status(200).json(comments);
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(400).json({ message: "Provide a valid post id." });
    }
    return res
      .status(500)
      .json({ message: "Internal server error while creating a comment." });
  }
};

//GET single comment

export const getComment = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide comment id." });
  }
  try {
    const comment = await CommentModel.getCommentById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    return res.status(200).json(comment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error while creating a comment." });
  }
};

//PUT method to update the comment

export const updateComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  if (!content) {
    return res.status(400).json({ message: "Content is required." });
  }
  try {
    const updatedComment = await CommentModel.updateComment(id, content);
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    return res.status(200).json(updatedComment);
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(404).json({ message: "Provide a valid comment id." });
    }
    console.error("Error updating comment:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

//DELETE method to delete the comment
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await CommentModel.deleteComment(id);
    if (!success) {
      return res
        .status(404)
        .json({ message: "Comment not found or unauthorized." });
    }
    return res.status(204).send();
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(404).json({ message: "Comment not found." });
    }

    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ message: "Internal server error while deleting a comment." });
  }
};
