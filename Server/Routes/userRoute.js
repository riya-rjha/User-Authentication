import userModel from "../Models/userModel.js";
import express from "express";
import bcrypt from "bcrypt";

const userRouter = express.Router();

// Register
userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPwd = await bcrypt.hash(password, 10);
  try {
    const newUser = new userModel({ username, email, password: hashedPwd });
    await newUser.save();
    return res.status(202).json({
      message: "User successfully registered",
      newUser,
    });
  } catch (error) {
    return res.status(402).json("User is already registered");
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isPasswordTrue) return res.status(401).json("Incorrect password");
    if (!user) return res.status(401).json("User does not exist");
    return res.status(202).json("Login successful");
  } catch (error) {
    return res.status(501).json("An error occurred while logging the user");
  }
});

// Logout
userRouter.post("/logout", async (req, res) => {
  try {
    const { id } = req.body;
    const user = userModel.findById(id);
    await user.deleteOne();
    return res.status(200).json("User successfully logged out");
  } catch (error) {
    return res.status(502).json("User could not be logged out");
  }
});

export default userRouter;
