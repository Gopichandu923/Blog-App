import db from "../config/db.js";
//To create a comment

export const createComment = async (post_id, content, user_id) => {
  const result = await db.query(
    "INSERT INTO comments (post_id,content,user_id) VALUES ($1,$2,$3) RETURNING *;",
    [post_id, content, user_id]
  );
  return result.rows[0];
};

//To get all comments of a post
export const getAllComments = async (post_id) => {
  const result = await db.query(
    "SELECT c.id,c.user_id,u.username as author,c.content,c.created_at FROM comments c JOIN users u ON c.user_id=u.id WHERE c.post_id=$1 ORDER BY created_at ASC;",
    [post_id]
  );
  return result.rows;
};

//Get a single comment by ID
export const getCommentById = async (id) => {
  const result = await db.query(
    "SELECT c.id,c.user_id,u.username as author,c.post_id,c.content,c.created_at,c.updated_at FROM comments c JOIN users u ON c.user_id=u.id WHERE c.id=$1;",
    [id]
  );
  return result.rows[0];
};

//Update an existing comment
export const updateComment = async (id, content) => {
  const result = await db.query(
    "UPDATE comments SET content=$1,updated_at=CURRENT_TIMESTAMP WHERE id=$2 RETURNING *;",
    [content, id]
  );
  return result.rows[0];
};

//Delete a comment by ID
export const deleteComment = async (id) => {
  const result = await db.query(
    "DELETE FROM comments WHERE id=$1 RETURNING id;",
    [id]
  );
  return result.rowCount > 0;
};
