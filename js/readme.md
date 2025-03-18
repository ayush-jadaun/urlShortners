# URL Shortener

A full-stack URL shortening service made in JavaScript with advanced features including password protection, QR code generation, expiration dates, and click tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Security](#security)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- 🔗 **Short URL Generation:** Shorten long URLs into compact, shareable links.
- 🔒 **Password Protection:** Secure sensitive URLs with password authentication.
- 📊 **Click Tracking:** Monitor the number of clicks each shortened URL receives.
- 📱 **QR Code Generation:** Generate QR codes for easy mobile sharing.
- 🔍 **Custom Aliases:** Create personalized short URLs with custom aliases.
- 💾 **URL Information Retrieval:** Access detailed URL data and analytics.
- 🚀 **Caching System:** Boost performance with Redis caching.
- 🛡️ **Rate Limiting:** Prevent abuse with per-IP rate limiting powered by Redis.

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose for data persistence
- **Redis** for caching and rate limiting
- **bcrypt** for password hashing
- **QRCode** for generating QR codes
- **crypto** for generating short codes

### Frontend
- **React.js** for building interactive UIs
- **React Router** for client-side routing
- **Zustand** for state management
- **Tailwind CSS** for rapid, utility-first styling
- **Axios** for API requests

## Security

- **Quantum Resistant Hashing:** This project uses the SHA3-256 algorithm—a quantum resistant hashing algorithm—for generating short codes. This modern cryptographic approach ensures that the hashing process remains secure even as quantum computing advances.

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install backend dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../client
   npm install
   ```

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password (if applicable)
```

> **Note:** Ensure that your environment variables are correctly set before starting the servers.

## Usage

1. **Start the Backend Server:**

   ```bash
   cd server
   npm start
   ```

2. **Start the Frontend Development Server:**

   ```bash
   cd client
   npm start
   ```

3. **Access the Application:**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint                          | Description                                  |
|--------|-----------------------------------|----------------------------------------------|
| POST   | `/api/url/shorten`                | Create a new shortened URL                   |
| GET    | `/api/url/:shortCode`             | Redirect to the original URL                 |
| POST   | `/api/url/:shortCode/verify`      | Verify password for protected URLs           |
| GET    | `/api/url/info/:shortCode`        | Retrieve information about a shortened URL   |

### Request Examples

#### Shorten a URL

```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/very/long/url/that/needs/shortening"}'
```

#### Shorten a URL with Password Protection

```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/sensitive-content", "password": "securepassword"}'
```

#### Shorten a URL with Custom Alias

```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/my-page", "customAlias": "mypage"}'
```

## Project Structure

```
url-shortener/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main application component
│   │   └── store.js       # Zustand store
│   └── ...
├── server/                # Backend Express application
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Express middlewares (e.g., rate limiter, caching)
│   ├── models/            # Mongoose models for MongoDB
│   ├── routes/            # Express routes
│   └── server.js          # Entry point for the backend server
└── README.md              # This file
```

## Deployment

### Frontend (Vercel)
Deploy the React app to [Vercel](https://vercel.com):
- Ensure the repository contains a valid build script (usually `npm run build`) and use a `vercel.json` for custom routing if necessary.
- Set the environment variable `REACT_APP_API_URL` to point to your backend service URL.

Example `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend (Render)
Deploy the backend to [Render](https://render.com) using the **Web Services** option:
- Even if your project doesn’t have a build step, you can specify `npm install` as a dummy build command.
- Ensure your `package.json` has the `"start": "node server.js"` script.
- Set your environment variables in Render's dashboard (PORT, MONGODB_URI, BASE_URL, CLIENT_URL, REDIS_*).

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the repository.**
2. **Create a new branch:**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes:**

   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to your branch:**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request.**

## License

This project is open source, and contributions are encouraged. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [QRCode](https://www.npmjs.com/package/qrcode) for QR code generation.
- [bcrypt](https://www.npmjs.com/package/bcrypt) for secure password hashing.
- [Mongoose](https://mongoosejs.com/) for MongoDB object modeling.
- [Express](https://expressjs.com/) as the web framework.
- [React](https://reactjs.org/) for building the frontend interface.
- [Zustand](https://github.com/pmndrs/zustand) for state management.