import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config'

const app = express();

app.use(express.json());

app.use(cors());

app.listen(process.env.PORT || 7064, () => {
  console.log(`App listening to PORT ${process.env.PORT}`);
});

const fetchData = async () => {
  try {
    await mongoose.connect(process.env.mongoDBURL);
    console.log("Database successfully connected");
  } catch (error) {
    console.log("Error connecting to database");
  }
};

fetchData();
