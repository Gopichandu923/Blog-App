import db from "../config/db.js";

//Create a new post
export const createPost = async (title, content, user_id) => {
  const result = await db.query(
    "INSERT INTO posts (title,content,author_id) VALUES($1,$2,$3) RETURNING id,title,content,user_id;",
    [title, content, user_id]
  );
  return result.rows[0];
};

//Get all posts
export const getAllPosts = async () => {
  const result = await db.query(
    "SELECT p.id,p.author_id,u.username as author,p.title,p.content,p.created_at FROM posts p JOIN users u ON p.author_id=u.id;"
  );
  return result.rows;
};

//Get particular post
export const getPostById = async (id) => {
  const result = await db.query(
    "SELECT p.id,p.author_id,u.username,p.title,p.content,p.created_at,p.updated_at FROM posts p JOIN users u ON p.author_id=u.id WHERE p.id=$1;",
    [id]
  );
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
  return result.rowCount > 0;
};
