import express from "express";
import {
  shortenUrl,
  getShortenUrl,
  redirectUrl,
} from "../controllers/urlController.js";

const router = express.Router();

router.post("/shorten", shortenUrl);
router.get("/:shortCode", redirectUrl);
router.get("/info/:shortCode", getShortenUrl);

export default router;
