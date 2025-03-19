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
    const isProtected = await redisClient.sismember(
      "protected_urls",
      shortCode
    );

    if (isProtected) {
      console.log(`Protected URL detected: ${shortCode} - Skipping cache`);
      return next();
    }

    const cachedData = await redisClient.get(shortCode);

    if (cachedData) {
      const { longUrl } = JSON.parse(cachedData);
      console.log("Cache Hit ✅ - Redirecting to cached URL");
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
    if (isPasswordProtected) {
      console.log(`Marking as protected URL: ${shortCode}`);
      await redisClient.sadd("protected_urls", shortCode);
      // Make sure it's not in the regular cache
      await redisClient.del(shortCode);
      return;
    }

    const isProtected = await redisClient.sismember(
      "protected_urls",
      shortCode
    );
    if (isProtected) {
      console.log(`URL ${shortCode} is marked as protected - not caching`);
      return;
    }

    const cacheValue = JSON.stringify({ longUrl });
    await redisClient.set(shortCode, cacheValue, "EX", 86400);
    console.log(`Cached in Redis 🔥 (ShortCode: ${shortCode})`);
  } catch (error) {
    console.error("Error caching URL:", error);
  }
};

export const markUrlAsProtected = async (shortCode) => {
  try {
    await redisClient.sadd("protected_urls", shortCode);
    await redisClient.del(shortCode);
    console.log(`Marked ${shortCode} as password-protected`);
  } catch (error) {
    console.error("Error marking URL as protected:", error);
  }
};

process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("🔴 Redis connection closed");
  process.exit(0);
});
