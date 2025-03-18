import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "https://urlshortners-1fte.onrender.com/api/url";

const useUrlStore = create((set, get) => ({
  longUrl: "",
  shortUrl: "",
  shortCode: "",
  qrCode: "",
  clicks: 0,
  expiresAt: null,
  loading: false,
  error: null,
  requiresPassword: false,
  password: "",

  setLongUrl: (url) => set({ longUrl: url }),
  setPassword: (password) => set({ password }),

  // Now accepts an object with password, customAlias, and expiresAt.
  shortenUrl: async ({
    password = "",
    customAlias = "",
    expiresAt = "",
  } = {}) => {
    const { longUrl } = get();

    try {
      if (!longUrl.trim()) {
        return set({ error: "URL is required" });
      }
      new URL(longUrl); // This will throw if longUrl is invalid
    } catch (e) {
      return set({
        error: "Please enter a valid URL including http:// or https://",
      });
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${API_BASE_URL}/shorten`, {
        longUrl,
        password: password.trim() ? password : undefined,
        customAlias: customAlias.trim() ? customAlias : undefined,
        expiresAt: expiresAt.trim() ? expiresAt : undefined,
      });

      set({
        shortUrl: response.data.shortUrl,
        shortCode: response.data.shortCode,
        qrCode: response.data.qrCode,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Something went wrong",
        loading: false,
      });
    }
  },

  fetchUrlInfo: async (shortCode) => {
    if (!shortCode) {
      return set({ error: "Short code is required" });
    }
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/info/${shortCode.trim()}`
      );
      set({
        longUrl: response.data.longUrl,
        shortCode: response.data.shortCode,
        shortUrl: response.data.shortUrl,
        clicks: response.data.clicks,
        expiresAt: response.data.expiresAt,
        requiresPassword: response.data.requiresPassword,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "URL info fetch failed",
        loading: false,
      });
    }
  },

  verifyPasswordAndGetUrl: async (shortCode, password) => {
    if (!shortCode || !password) {
      return set({ error: "Short code and password are required" });
    }
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${shortCode.trim()}/verify`,
        { password }
      );
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Password verification failed",
        loading: false,
      });
      return false;
    }
  },
}));

export default useUrlStore;
