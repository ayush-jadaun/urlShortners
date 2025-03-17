import React, { useState } from "react";
import useUrlStore from "../store/urlStore";

const ShortenForm = () => {
  const { longUrl, shortUrl, qrCode, setLongUrl, shortenUrl, loading, error } =
    useUrlStore();
  const [showPasswordOption, setShowPasswordOption] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await shortenUrl(password);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Short URL copied to clipboard!");
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3">Create Short URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter your long URL (including http:// or https://)"
          className="p-2 w-full border rounded mb-3"
          required
        />

        <div className="mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showPasswordOption}
              onChange={() => setShowPasswordOption(!showPasswordOption)}
              className="mr-2"
            />
            <span>Password protect this URL</span>
          </label>
        </div>

        {showPasswordOption && (
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password for protection"
              className="p-2 w-full border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {shortUrl && (
        <div className="mt-4 p-3 bg-white rounded border">
          <p className="font-medium">Your short URL:</p>
          <div className="flex items-center mt-1">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all mr-2"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => copyToClipboard(shortUrl)}
              className="ml-auto bg-gray-200 p-1 rounded hover:bg-gray-300 text-sm"
            >
              Copy
            </button>
          </div>
          {showPasswordOption && password && (
            <p className="mt-2 text-sm text-gray-600">
              <i className="fas fa-lock mr-1"></i>
              This URL is password protected
            </p>
          )}
          {qrCode && (
            <div className="mt-3">
              <p className="font-medium">QR Code:</p>
              <img
                src={qrCode}
                alt="QR Code"
                className="mt-2 mx-auto max-w-[150px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortenForm;
