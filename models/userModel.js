import { query } from "../config/db.js";

export const findUserByEmailOrUsername = async (identifier) => {
  const result = await query("SELECT * FROM users WHERE name=$1 OR email=$2", [
    identifier,
    identifier,
  ]);
};

export const findUserByEmail = async (email) => {
  const result = await query(
    "SELECT id,name,email,created_at FROM  users WHERE email=$1",
    [email]
  );
  console.log(result);
  return result.rows[0];
};

export const createUser = async (username, email, password) => {
  const result = await query(
    "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email",
    [username, email, password]
  );
  console.log(result);
  return result.rows[0];
};
