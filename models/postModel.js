import db from "../config/db.js";

//Create a new post
export const createPost = async (title, content, user_id) => {
  const result = await db.query(
    "INSERT INTO posts (title,content,user_id) VALUES($1,$2,$3) RETURNING id,title,content,user_id;",
    [title, content, user_id]
  );
  return result.rows[0];
};

//Get all posts
export const getAllPosts = async () => {
  const result = await db.query("SELECT * FROM posts;");
  return result.rows;
};

//Get particular post
export const getPost = async (id) => {
  const result = await db.query("SELECT * FROM posts WHERE id=$1;", [id]);
  return result.rows[0];
};

//Update the post
export const updatePost = async (id, title, content) => {
  const result = await db.query(
    "UPDATE posts SET title=$2,content=$3,updated_at=NOW() WHERE id=$1 RETURNING *",
    [id, title, content]
  );
  return result.rows[0];
};

//Delete the post
export const deletePost = async (id) => {
  const result = await db.query("DELETE FROM posts WHERE id=$1 RETURNING id", [
    id,
  ]);
  return result.rows.length > 0;
};
