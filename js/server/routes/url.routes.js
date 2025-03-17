import express from "express";
import {
  shortenUrl,
  getShortenUrl,
  redirectUrl,
  checkPasswordAndRedirect,
} from "../controllers/url.controller.js";
import { limiter } from "../middlewares/rateLimiter.js";
import { checkCache } from "../middlewares/cache.middleware.js";

const router = express.Router();

router.use(limiter);

router.post("/shorten", shortenUrl);
router.get("/:shortCode", checkCache, redirectUrl);
router.post("/:shortCode/verify", checkPasswordAndRedirect);
router.get("/info/:shortCode", getShortenUrl);

export default router;
