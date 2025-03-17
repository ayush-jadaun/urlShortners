import Url from "../models/url.model.js";
import { createHash } from "crypto";
import dotenv from "dotenv";
import { cacheUrl } from "../middlewares/cache.middleware.js";
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

    let shortCode =
      customAlias ||
      createHash("sha3-256").update(longUrl).digest("hex").slice(0, 8);

    if (customAlias) {
      const aliasExists = await Url.findOne({ shortCode: customAlias });
      if (aliasExists) {
        return res.status(400).json({ error: "Custom alias is already taken" });
      }
    }

    const existingUrl = await Url.findOne({ shortCode });

    if (existingUrl) {
      if (existingUrl.expiresAt && new Date() > existingUrl.expiresAt) {
        await Url.deleteOne({ _id: existingUrl._id });
      } else {
        return res.json({
          shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
          shortCode: existingUrl.shortCode,
          qrCode: existingUrl.qrCode,
        });
      }
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

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      shortCode,
      qrCode,
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
      // For password-protected URLs, redirect to the password entry page
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
      // URL doesn't need a password
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
    await cacheUrl(shortCode, urlEntry.longUrl);

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
