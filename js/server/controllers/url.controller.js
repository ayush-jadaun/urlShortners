import Url from "../models/url.model.js";
import { createHash } from "crypto";
import dotenv from "dotenv";
import { cacheUrl} from "../middlewares/cache.middleware.js";

dotenv.config();

export const shortenUrl = async (req, res) => {
  const { longUrl, expiresAt } = req.body;

  try {
    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortCode = createHash("sha3-256")
      .update(longUrl)
      .digest("hex")
      .slice(0, 8);

    const existingUrl = await Url.findOne({ shortCode });

    if (existingUrl) {
      if (existingUrl.expiresAt && new Date() > existingUrl.expiresAt) {
        await Url.deleteOne({ _id: existingUrl._id });
      } else {
        return res.json({
          shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
        });
      }
    }

    const newUrl = new Url({ longUrl, shortCode, expiresAt });
    await newUrl.save();

    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (err) {
    console.error("Error in creating short URL:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const redirectUrl = async (req, res) => {
  console.log("req.params:", req.params);
  const { shortCode } = req.params;
  if (!shortCode) {
    return res.status(400).json({ error: "Short code is required" });
  }

  try {
 
    console.log("Cache Miss ❌ - Proceeding to DB...");
    const urlEntry = await Url.findOne({ shortCode });
    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    if (urlEntry.expiresAt && new Date() > urlEntry.expiresAt) {
      await Url.deleteOne({ _id: urlEntry._id });
      return res.status(410).json({ error: "Short URL has expired" });
    }

    urlEntry.clicks += 1;
    await urlEntry.save();

    await cacheUrl(shortCode, urlEntry.longUrl);

    res.redirect(urlEntry.longUrl);
  } catch (err) {
    console.error("Error in redirecting:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getShortenUrl = async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      longUrl: urlEntry.longUrl,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      clicks: urlEntry.clicks,
      createdAt: urlEntry.createdAt,
      expiresAt: urlEntry.expiresAt,
    });
  } catch (err) {
    console.error("Error fetching URL:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
