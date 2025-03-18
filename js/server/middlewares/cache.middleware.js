import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

export const checkCache = async (req, res, next) => {
  console.log("Inside checkCache - req.params:", req.params);
  const { shortCode } = req.params;

  try {
    // First, check if URL is in cache
    const cachedData = await redisClient.get(shortCode);

    if (cachedData) {
      // Check if we've cached both the URL and a password flag
      // Format in Redis: "url:isPasswordProtected" (e.g., "https://example.com:1")
      const [cachedUrl, isPasswordProtected] = cachedData.split(":");

      // If URL is password protected, don't redirect from cache
      if (isPasswordProtected === "1") {
        console.log(
          "Cache Hit ✅ - But URL is password protected, proceeding to controller"
        );
        return next();
      }

      console.log(
        "Cache Hit ✅ - URL not password protected, redirecting directly"
      );
      return res.redirect(cachedUrl);
    }

    console.log("Cache Miss ❌ - Proceeding to DB...");
    next();
  } catch (error) {
    console.error("Redis Error:", error);
    next();
  }
};
export const cacheUrl = async (
  shortCode,
  longUrl,
  isPasswordProtected = false
) => {
  try {
    // Store URL with password protection flag
    // Format: "url:isPasswordProtected" (e.g., "https://example.com:1")
    const cacheValue = `${longUrl}:${isPasswordProtected ? "1" : "0"}`;

    await redisClient.set(shortCode, cacheValue, "EX", 86400);
    console.log(
      `Cached in Redis 🔥 (Password Protected: ${isPasswordProtected})`
    );
  } catch (error) {
    console.error("Error caching URL:", error);
  }
};