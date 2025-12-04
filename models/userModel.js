import db from "../config/db.js";

const { query } = db;

export const findUserByEmailOrUsername = async (identifier) => {
  const result = await query(
    "SELECT * FROM users WHERE username=$1 OR email=$2",
    [identifier, identifier]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await query(
    "SELECT id,username,email,created_at FROM  users WHERE email=$1",
    [email]
  );
  return result.rows[0];
};

export const createUser = async (username, email, password) => {
  const result = await query(
    "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email",
    [username, email, password]
  );
  return result.rows[0];
};
