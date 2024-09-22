# AI Chat Application

This project consists of a backend API built with FastAPI and a frontend application built with Next.js. The backend uses Ollama for AI model integration and ElevenLabs for text-to-speech functionality.

## Project Structure
```
.
├── backend/
│ ├── main.py
│ ├── requirements.txt
│ └── Dockerfile
├── frontend/
│ ├── package.json
│ ├── next.config.js
│ ├── tailwind.config.ts
│ ├── tsconfig.json
│ └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Backend Dependencies

The backend is built using Python 3.9 and FastAPI. Here are the main dependencies:

- FastAPI: A modern, fast (high-performance) web framework for building APIs with Python.
- Uvicorn: An ASGI server implementation, using uvloop and httptools.
- Ollama: An AI model integration tool for running large language models locally.
- ElevenLabs API: Used for text-to-speech functionality (requires an API key).

For a complete list of backend dependencies, see `backend/requirements.txt`.

To install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### Ollama Setup

Ollama needs to be installed separately. Please follow the installation instructions on the [Ollama GitHub page](https://github.com/jmorganca/ollama).

## Frontend Dependencies

The frontend is built using Next.js 13 with TypeScript. Main dependencies include:

- React: A JavaScript library for building user interfaces.
- Next.js: A React framework for production-grade applications.
- Tailwind CSS: A utility-first CSS framework.
- TypeScript: A typed superset of JavaScript.

For a complete list of frontend dependencies, see `frontend/package.json`.

To install frontend dependencies:

```bash
npm install
```

## Running the Application

You can run the entire application using Docker Compose:

```bash
docker-compose up --build
```

### Environment Variables

The backend requires an ElevenLabs API key. Set this in a `.env`

```bash
ELEVENLABS_API_KEY=<your_elevenlabs_api_key>
```

## Development

- Backend development server: `uvicorn main:app --reload`
- Frontend development server: `npm run dev`

For more detailed instructions on development and deployment, please refer to the individual README files in the backend and frontend directories.

## Ollama Integration

Ensure that Ollama is properly set up and running on your system before starting the backend. The backend interacts with Ollama to leverage AI models for chat functionality.

For more information on how to use and configure Ollama, please refer to their official documentation.