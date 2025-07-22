# Binge - Modern OTT Platform

A feature-rich Over-The-Top (OTT) streaming platform built with modern technologies.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Vite

### Backend
- Node.js
- Express
- TypeScript
- Supabase (Database & Authentication)

## Project Structure

```
binge-ott-platform/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React context providers
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── config/           # Configuration files
│
└── package.json          # Root package.json for workspace management
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/binge-ott-platform.git
cd binge-ott-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create `.env` files in both `client` and `server` directories
   - Add necessary environment variables (see `.env.example` files)

4. Start the development servers:
```bash
npm run dev
```

## Features

- User authentication and authorization
- Video streaming with adaptive bitrate
- Content categorization and search
- User profiles and watchlists
- Responsive design for all devices
- Real-time updates and notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 