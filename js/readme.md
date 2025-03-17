# URL Shortener

A full-stack URL shortening service made in javascript with advanced features including password protection, QR code generation, expiration dates, and click tracking.

## Features

- 🔗 Shorten long URLs into compact, shareable links
- 🔒 Password protection for sensitive URLs
- 📊 Track the number of clicks for each shortened URL
- 📱 QR code generation for easy mobile sharing
- 🔍 Custom alias support for personalized short URLs
- 💾 URL information retrieval
- 🚀 Caching system for improved performance
- 🛡️ Rate limiting to prevent abuse

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Redis for caching
- bcrypt for password hashing
- QRCode for generating QR codes
- crypto for generating short codes

### Frontend
- React.js
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- Axios for API requests

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. Install dependencies for backend
   ```bash
   cd server
   npm install
   ```

3. Install dependencies for frontend
   ```bash
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   BASE_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   REDIS_URL=your_redis_connection_string (if using Redis)
   ```

## Usage

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

3. Access the application at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/url/shorten` | Create a new shortened URL |
| GET | `/api/url/:shortCode` | Redirect to the original URL |
| POST | `/api/url/:shortCode/verify` | Verify password for protected URLs |
| GET | `/api/url/info/:shortCode` | Get information about a shortened URL |

### Request Examples

#### Shorten a URL
```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/very/long/url/that/needs/shortening"}'
```

#### Shorten a URL with password protection
```bash
curl -X POST http://localhost:5000/api/url/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/sensitive-content", "password": "securepassword"}'
```

#### Shorten a URL with custom alias
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
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   └── server.js          # Entry point
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This Project is open source. Contributions are encouraged.

## Acknowledgments

- [QRCode](https://www.npmjs.com/package/qrcode) for QR code generation
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
- [Mongoose](https://mongoosejs.com/) for MongoDB object modeling
- [Express](https://expressjs.com/) for the web framework
- [React](https://reactjs.org/) for the frontend library
- [Zustand](https://github.com/pmndrs/zustand) for state management