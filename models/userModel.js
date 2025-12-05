import db from "../config/db.js";

export const findUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await db.query("SELECT id FROM users WHERE id=$1", [id]);
  return result.rowCount === 1;
};

export const findUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT id,username,email,created_at,password FROM  users WHERE email=$1",
    [email]
  );
  return result.rows[0];
};

export const createUser = async (username, email, password) => {
  const result = await db.query(
    "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email",
    [username, email, password]
  );
  return result.rows[0];
};
