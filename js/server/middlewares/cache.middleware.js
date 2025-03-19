import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    return Math.min(times * 50, 2000); 
  },
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis successfully!");
});

export const checkCache = async (req, res, next) => {
  console.log("Inside checkCache - req.params:", req.params);
  const { shortCode } = req.params;

  try {
    const cachedData = await redisClient.get(shortCode);

    if (cachedData) {

      const { longUrl, isPasswordProtected } = JSON.parse(cachedData);

      if (isPasswordProtected) {
        console.log(
          "Cache Hit ✅ - But URL is password protected, proceeding to controller"
        );
        return next();
      }

      console.log(
        "Cache Hit ✅ - URL not password protected, redirecting directly"
      );
      return res.redirect(longUrl);
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
    const cacheValue = JSON.stringify({ longUrl, isPasswordProtected });

    await redisClient.set(shortCode, cacheValue, "EX", 86400);
    console.log(
      `✅ Cached in Redis (Password Protected: ${isPasswordProtected})`
    );
  } catch (error) {
    console.error("Error caching URL:", error);
  }
};


process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("🔴 Redis connection closed");
  process.exit(0);
});
