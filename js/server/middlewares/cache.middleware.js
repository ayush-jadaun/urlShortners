import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});


export const checkCache = async (req, res, next) => {
  const { shortCode } = req.params;
    console.log("Inside checkCache - req.params:", req.params);


  try {
    const cachedUrl = await redisClient.get(shortCode);
    if (cachedUrl) {
      console.log("Cache Hit ✅ - Redirecting");
      return res.redirect(cachedUrl);
    }

    console.log("Cache Miss ❌ - Proceeding to DB...");
    next();
  } catch (error) {
    console.error("Redis Error:", error);
    next();
  }
};


export const cacheUrl = async (shortCode, longUrl) => {
  try {
    await redisClient.set(shortCode, longUrl, "EX", 86400); // Store with 24-hour expiry
    console.log("Cached in Redis 🔥");
  } catch (error) {
    console.error("Error caching URL:", error);
  }
};
