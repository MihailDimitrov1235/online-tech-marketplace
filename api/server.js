import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "./loadEnvironments.js";

import usersRouter from "./routes/User.routes.js";

const PORT = process.env.PORT || 8000;
const URI = process.env.DB_URI;

const app = express();

app.use(cors());
app.use(express.json());

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.");
});

app.use("/users", usersRouter);

async function startServer() {
  try {
    await mongoose.connect(URI);
    console.log("Successfully connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

startServer();
