# TripBuddy - AI-Powered Travel Planner

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)

**Live Preview:** https://trip-buddy.vercel.app/

TripBuddy is an AI-powered travel planning application that creates personalized trip itineraries through conversational interactions. It leverages generative AI to understand user preferences and generate detailed travel plans with real-world places, activities, and restaurants.

## Architecture

```
trip-advisor-/
├── client/                 # Next.js 14 frontend (TypeScript)
│   ├── app/               # App router pages
│   ├── components/       # React components
│   ├── store/            # RTK Query API slices
│   ├── libs/             # Supabase, server API clients
│   └── types/            # OpenAPI generated types
├── server/               # FastAPI backend (Python)
│   ├── routers/          # API endpoints
│   └── libs/             # AI integrations (Vertex AI, LangChain)
├── server-previous/      # Legacy Python server
└── client-previous/      # Legacy React client
```

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with DaisyUI
- **RTK Query** for API state management
- **Framer Motion** for animations
- **Supabase Auth UI** for authentication

### Backend
- **FastAPI** REST API server
- **Google Vertex AI** (PaLM/Gemini) for LLM-powered itinerary generation
- **LangChain** for AI pipeline orchestration
- **Supabase** for database and storage
- **Redis** for caching
- **Cloudinary** for image optimization
- **Firebase** for additional services

### Key Features
- Conversational AI itinerary creation
- Google Places integration
- Interactive Google Maps
- User authentication (Google OAuth)
- Trip management (create, view, past trips)
- Place exploration with photos
- Real-time streaming responses from AI

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Docker & Docker Compose (for local development)

### Environment Variables

Create `.env` files in both `client/` and `server/` directories:

**Client (`client/.env`)**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Server (`server/.env`)**
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=path/to/service_account.json
VERTEX_AI_PROJECT=your_project_id

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Cloudinary
CLOUDINARY_URL=your_cloudinary_url
```

### Local Development

```bash
# Start all services (Redis + API server)
docker compose -f compose.local.yml up

# Or start client separately
cd client && npm install && npm run dev
```

Access:
- Client: http://localhost:3000
- API Docs: http://localhost:8000/docs

### Production Build

```bash
cd client
npm install
npm run build
npm start
```

## Project Structure

### Client Routes
- `/` - Main dashboard (protected)
- `/welcome` - Landing page
- `/auth` - Authentication
- `/trips/[trip-id]` - Trip details
- `/itineraries/[itinerary-id]` - Itinerary view
- `/places/[place-name]` - Place details

### API Endpoints
- `GET /locations/{location_name}` - Get location info
- `GET /users/{user_id}/trips` - Get user trips
- `POST /photos/retrieve_url` - Get photo URLs
- Full API documentation at `/docs`

## Development Notes

This project originated from Google Partner Innovation collaboration with Agoda, exploring how generative AI can transform travel planning. The system uses a multi-LLM approach where:

1. **LLM #1** - Creates itinerary structure from user messages
2. **LLM #2** - Enriches places with descriptions

The prompt design supports iterative refinement, allowing users to modify their itinerary through conversation.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Developed in collaboration with Google Partner Innovation Team and Agoda for APAC travel innovation.
