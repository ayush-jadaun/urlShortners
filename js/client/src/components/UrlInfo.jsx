import React, { useState } from "react";
import useUrlStore from "../store/urlStore";

const UrlInfo = () => {
  const {
    fetchUrlInfo,
    verifyPasswordAndGetUrl,
    longUrl,
    shortUrl,
    shortCode,
    clicks,
    expiresAt,
    requiresPassword,
    loading,
    error,
    setPassword,
  } = useUrlStore();

  const [inputShortCode, setInputShortCode] = useState("");
  const [password, setPasswordLocal] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleFetchInfo = () => {

    let code = inputShortCode.trim();


    if (code.includes("/")) {
      code = code.split("/").pop();
    }

    fetchUrlInfo(code);
    setShowPasswordForm(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    verifyPasswordAndGetUrl(shortCode, password);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-3">URL Info</h2>

      <div className="mb-4">
        <input
          type="text"
          value={inputShortCode}
          onChange={(e) => setInputShortCode(e.target.value)}
          placeholder="Enter short code or paste short URL"
          className="p-2 w-full border rounded"
        />
        <button
          onClick={handleFetchInfo}
          disabled={loading || !inputShortCode.trim()}
          className="mt-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full transition"
        >
          {loading ? "Loading..." : "Fetch Info"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {requiresPassword && !showPasswordForm && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-medium">This URL is password protected</p>
          <button
            onClick={() => setShowPasswordForm(true)}
            className="mt-2 bg-blue-500 text-white p-1 rounded text-sm"
          >
            Enter Password
          </button>
        </div>
      )}

      {showPasswordForm && (
        <form
          onSubmit={handlePasswordSubmit}
          className="mb-4 p-3 bg-gray-50 border rounded"
        >
          <p className="font-medium mb-2">Enter password to access this URL:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPasswordLocal(e.target.value)}
            placeholder="Password"
            className="p-2 w-full border rounded mb-2"
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full transition"
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </form>
      )}

      {longUrl && !requiresPassword && (
        <div className="p-3 bg-gray-50 border rounded">
          <h3 className="font-medium text-lg mb-2">URL Information</h3>
          <p className="mb-1">
            <span className="font-medium">Original URL:</span>{" "}
            <a
              href={longUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 break-all"
            >
              {longUrl}
            </a>
          </p>
          <p className="mb-1">
            <span className="font-medium">Short URL:</span>{" "}
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {shortUrl}
            </a>
          </p>
          <p className="mb-1">
            <span className="font-medium">Clicks:</span> {clicks}
          </p>
          <p>
            <span className="font-medium">Expires:</span>{" "}
            {expiresAt ? new Date(expiresAt).toLocaleString() : "Never"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UrlInfo;
