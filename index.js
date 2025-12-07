import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/user.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

const PORT = process.env.PORT_NUM;

app.get("/", (req, res) => {
  res.send("Welcome to Blog App.");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
