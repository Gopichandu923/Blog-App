import * as PostModel from "../models/postModel.js";
import * as UserModel from "../models/userModel.js";

//POST method to create a post

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const user = req.user;
  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Please provide title and content." });
  }
  try {
    const newPost = await PostModel.createPost(title, content, user.id);
    res
      .status(201)
      .json({ message: "Successfully created the post.", newPost });
  } catch (error) {
    console.log("Error creating post", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//GET method to get all posts
export const getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.getAllPosts();
    return res
      .status(200)
      .json({ message: "Successfully retrieved posts", posts: posts });
  } catch (error) {
    console.log("Error retrieving posts", error);
    res
      .status(500)
      .json({ message: "Internal server error while retrieving posts." });
  }
};

//GET method to get particular post

export const getPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide post id." });
  }
  try {
    const post = await PostModel.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    return res.status(200).json(post);
  } catch (error) {
    if (error.code === "22P02") {
      console.warn(`User attempted to search with invalid UUID format:${id}`);
      res.status(404).json({ message: "Post not found." });
    }
    console.log("Error retrieving post ", error);
    res
      .status(500)
      .json({ message: "Internal server error while retrieving post." });
  }
};

//PUT method for updating posts
export const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const user = req.user;
  if (!id || !title || !content) {
    return res.status(400).json({
      message:
        "Please provide title ,id,and content are required for the update.",
    });
  }
  try {
    const post = await PostModel.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.user_id !== user.id) {
      return res
        .status(403)
        .json({ message: "Only author is allowed to modify this post." });
    }
    const updatedPost = await PostModel.updatePost(id, title, content);
    res.status(200).json(updatedPost);
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(404).json({ message: "Post not found." });
    }
    console.log("Error updating the post", error);
    res
      .status(500)
      .json({ message: "Internal server error while updating the post." });
  }
};

//DELETE method for deleting the post
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Please provide id of the post required to delete." });
  }
  try {
    const post = await PostModel.getPost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.user_id !== user.id) {
      return res
        .status(403)
        .json({ message: "Only author is allowed to delete this post." });
    }
    const deletedPost = await PostModel.deletePost(id);
    if (deletedPost)
      res.status(200).json({ message: `Successfully deleted the post ${id}` });
  } catch (error) {
    if (error.code === "22P02") {
      return res.status(404).json({ message: "Post not found." });
    }
    console.log("Error deleting the post", error);
    res
      .status(500)
      .json({ message: "Internal server error while deleting the post." });
  }
};
