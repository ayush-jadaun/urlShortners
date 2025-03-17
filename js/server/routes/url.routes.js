import express from "express";
import {
  shortenUrl,
  getShortenUrl,
  redirectUrl,
} from "../controllers/url.controller.js";
import { limiter } from "../middlewares/rateLimiter.js";
import { checkCache } from "../middlewares/cache.middleware.js";

const router = express.Router();

router.use(limiter);

router.post("/shorten", shortenUrl);
router.get("/:shortCode", checkCache, redirectUrl); 
router.get("/info/:shortCode", getShortenUrl);

export default router;
