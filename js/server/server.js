import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import CORS
import connectDb from "./db/db.js";
import urlRoutes from "./routes/url.routes.js";

dotenv.config("./.env");
console.log("BASE_URL:", process.env.BASE_URL);

const app = express();

connectDb();

// CORS Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test route connected ✅");
});

app.use("/api/url", urlRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
