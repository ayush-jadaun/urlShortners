import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const useUrlStore = create((set, get) => ({
  urls: [],
  longUrl: "",
  shortUrl: "",
  qrCode: "",
  password: "",
  clicks: 0,
  expiresAt: null,
  loading: false,
  error: null,

  setLongUrl: (url) => set({ longUrl: url }),
  setPassword: (password) => set({ password }),
  setExpiresAt: (date) => set({ expiresAt: date }),

  shortenUrl: async () => {
    const { longUrl, password, expiresAt } = get();
    if (!longUrl) return set({ error: "URL is required" });

    try {
      set({ loading: true, error: null });

      const response = await axios.post(`${BASE_URL}/api/url/shorten`, {
        longUrl,
        password: password || null,
        expiresAt,
      });

      set({
        shortUrl: response.data.shortUrl,
        qrCode: response.data.qrCode,
        urls: [...get().urls, response.data],
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Something went wrong",
        loading: false,
      });
    }
  },

  fetchUrlInfo: async (shortCode) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.get(`${BASE_URL}/api/url/info/${shortCode}`);
      set({
        longUrl: response.data.longUrl,
        clicks: response.data.clicks,
        expiresAt: response.data.expiresAt,
        qrCode: response.data.qrCode,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Short URL not found",
        loading: false,
      });
    }
  },
}));

export default useUrlStore;
