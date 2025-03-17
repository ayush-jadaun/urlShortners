import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import urlRoutes from "./routes/url.routes.js"

dotenv.config();

const app = express();


connectDb();


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Test route connected ✅");
});

app.use("/api/url",urlRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
