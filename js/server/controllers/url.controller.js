import Url from "../models/url.model.js";
import { createHash, randomBytes } from "crypto";
import dotenv from "dotenv";
import {
  cacheUrl,
  markUrlAsProtected,
} from "../middlewares/cache.middleware.js";
import QRCode from "qrcode";
import bcrypt from "bcrypt";

dotenv.config();

export const shortenUrl = async (req, res) => {
  const { longUrl, expiresAt, customAlias, password } = req.body;

  try {
    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      new URL(longUrl);
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let shortCode;
    if (customAlias) {
      shortCode = customAlias;
      const aliasExists = await Url.findOne({ shortCode });
      if (aliasExists) {
        return res.status(400).json({ error: "Custom alias is already taken" });
      }
    } else {
      const uniqueInput = longUrl + Date.now() + randomBytes(4).toString("hex");
      shortCode = createHash("sha3-256")
        .update(uniqueInput)
        .digest("hex")
        .slice(0, 8);
    }

    const qrCode = await QRCode.toDataURL(
      `${process.env.BASE_URL}/${shortCode}`
    );

    let hashedPassword = password ? await bcrypt.hash(password, 8) : null;

    const newUrl = new Url({
      longUrl,
      shortCode,
      expiresAt,
      qrCode,
      password: hashedPassword,
    });

    await newUrl.save();

    // If it has a password, mark it as protected in Redis
    if (hashedPassword) {
      await markUrlAsProtected(shortCode);
    }

    res.json({
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
      shortCode: newUrl.shortCode,
      qrCode: newUrl.qrCode,
    });
  } catch (err) {
    console.error("Error in creating short URL:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const redirectUrl = async (req, res) => {
  const { shortCode } = req.params;

  if (!shortCode) {
    return res.status(400).json({ error: "Short code is required" });
  }

  try {
    console.log(`Looking up shortCode: ${shortCode}`);
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (urlEntry.expiresAt && new Date() > urlEntry.expiresAt) {
      await Url.deleteOne({ _id: urlEntry._id });
      return res.status(410).json({ error: "Short URL has expired" });
    }

    if (urlEntry.password) {
      await markUrlAsProtected(shortCode);
      return res.redirect(`${process.env.CLIENT_URL}/protected/${shortCode}`);
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

export const checkPasswordAndRedirect = async (req, res) => {
  const { shortCode } = req.params;
  const { password } = req.body;

  if (!shortCode || !password) {
    return res
      .status(400)
      .json({ error: "Short code and password are required" });
  }

  try {
    const urlEntry = await Url.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (urlEntry.expiresAt && new Date() > urlEntry.expiresAt) {
      await Url.deleteOne({ _id: urlEntry._id });
      return res.status(410).json({ error: "Short URL has expired" });
    }

    if (!urlEntry.password) {
      urlEntry.clicks += 1;
      await urlEntry.save();
      await cacheUrl(shortCode, urlEntry.longUrl);
      return res.json({ redirectUrl: urlEntry.longUrl });
    }

    const isMatch = await bcrypt.compare(password, urlEntry.password);
    if (!isMatch) {
      return res.status(403).json({ error: "Invalid password" });
    }

    urlEntry.clicks += 1;
    await urlEntry.save();

    await markUrlAsProtected(shortCode);

    return res.json({ redirectUrl: urlEntry.longUrl });
  } catch (err) {
    console.error("Error in password verification:", err);
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
      shortCode,
      qrCode: urlEntry.qrCode,
      clicks: urlEntry.clicks,
      createdAt: urlEntry.createdAt,
      expiresAt: urlEntry.expiresAt,
      requiresPassword: !!urlEntry.password,
    });
  } catch (err) {
    console.error("Error fetching URL:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
