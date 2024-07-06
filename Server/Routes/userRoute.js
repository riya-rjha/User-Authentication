import userModel from "../Models/userModel.js";
import express from "express";

const userRouter = express.Router();

// Register
userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json("Password length too small");
  }
  try {
    const newUser = new userModel({ username, email, password });
    await newUser.save();
    return res.status(202).json("User successfully registered");
  } catch (error) {
    return res.status(402).json("User not registered" + error.message);
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username, password });
    if (!user) return res.status(401).json("User does not exist");
    return res.status(202).json("Login successful");
  } catch (error) {
    return res.status(501).json("An error occurred while registering the user");
  }
});

export default userRouter;
