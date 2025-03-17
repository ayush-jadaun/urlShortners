import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PasswordProtectedUrl = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [urlInfo, setUrlInfo] = useState(null);

  useEffect(() => {
    const fetchUrlInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/url/info/${shortCode}`
        );
        setUrlInfo(response.data);
      } catch (err) {
        setError("URL not found or has expired");
      }
    };

    fetchUrlInfo();
  }, [shortCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/url/${shortCode}/verify`,
        { password }
      );

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (err) {
      setError(err.response?.data?.error || "Password verification failed");
      setLoading(false);
    }
  };

  if (!urlInfo) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Password Protected URL</h2>
      <p className="mb-4">This URL requires a password to access.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            required
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {loading ? "Verifying..." : "Access URL"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:underline"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PasswordProtectedUrl;
