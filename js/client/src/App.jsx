import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ShortenForm from "./components/ShortenForm";
import UrlInfo from "./components/UrlInfo";
import PasswordProtectedUrl from "./components/PasswordProtectedUrl";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">URL Shortener</h1>
            <nav className="mt-2">
              <ul className="flex space-x-4">
                <li>
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/info" className="hover:underline">
                    URL Info
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route
              path="/"
              element={
                <div className="max-w-md mx-auto">
                  <ShortenForm />
                </div>
              }
            />
            <Route
              path="/info"
              element={
                <div className="max-w-md mx-auto">
                  <UrlInfo />
                </div>
              }
            />
            <Route
              path="/protected/:shortCode"
              element={<PasswordProtectedUrl />}
            />
          </Routes>
        </main>

        <footer className="bg-gray-200 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            &copy; {new Date().getFullYear()} URL Shortener Service
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
