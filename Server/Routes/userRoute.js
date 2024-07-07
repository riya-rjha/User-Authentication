import userModel from "../Models/userModel.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const userRouter = express.Router();

// Middleware

const userAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.jwt_secretKey, (err) => {
      if (err) {
        return res.status(401).json("Invalid token");
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json("Not authorized, token not available");
  }
};

// Register
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isExistsUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isExistsUser) return res.status(202).json("User already exists");

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPwd,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.jwt_secretKey, {
      expiresIn: "1h",
    });

    res.cookie("access_token", token, {
      httpOnly: true,
    });

    await newUser.save();

    return res.status(202).json({
      message: "User successfully registered",
      newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(402).json("An error occurred while registering the user");
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

    const token = jwt.sign({ id: user._id }, process.env.jwt_secretKey, {
      expiresIn: "1h",
    });

    res.cookie("access_token", token, {
      httpOnly: true,
    });

    return res.status(202).json("Login successful");
  } catch (error) {
    return res.status(501).json("An error occurred while logging the user");
  }
});

// Logout
userRouter.post("/logout", userAuth, async (req, res) => {
  try {
    const { id } = req.body;
    const user = userModel.findById(id);
    await user.deleteOne();
    res.clearCookie("access_token");
    return res.status(200).json("User successfully logged out");
  } catch (error) {
    return res.status(502).json("User could not be logged out");
  }
});

export default userRouter;
