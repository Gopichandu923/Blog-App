import * as CommentModel from "../models/commentModel.js";

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
    return res.status(201).json({ message: "Successfully added the comment." });
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
    res.status(400).json({ message: "Please provide post id." });
  }
  try {
    const comments = await CommentModel.getAllComments(post_id);
    return res.status(200).json(comments);
  } catch (error) {
    if (error.code === "22P02") {
      return res
        .status(400)
        .json({ message: "Post doesn't exist with post id." });
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
    const comment = await CommentModel.getComment(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error while creating a comment." });
  }
};

//PUT method to update the comment

export const updateComment = async (req, res) => {};

//DELETE method to delete the comment

export const deleteComment = async (req, res) => {};
