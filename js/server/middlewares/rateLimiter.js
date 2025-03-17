import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();


export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT), 
  password: process.env.REDIS_PASSWORD,
});


redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

export const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
