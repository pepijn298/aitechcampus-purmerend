# AI Tech Campus - Starter Prototype

Public repository for the AI Tech Campus Purmerend prototype.

This starter scaffold contains a minimal Next.js site with a chat widget that proxies to OpenAI and a simple change-request flow (file-backed) for roster changes. It is a demo scaffold and not production-ready. Follow the security notes below before using real credentials.

Features in this commit:
- Next.js frontend (pages: /, /admin)
- Chat widget that calls /api/chat (proxies to OpenAI)
- Simple requests API (/api/requests) that stores requests to data/requests.json
- Admin UI to view and approve/deny requests
- .env.example and instructions

Security notes:
- Do NOT commit REAL API keys to this repo. Use environment variables or GitHub Secrets.
- Prototype stores requests in a flat JSON file for demo purposes; replace with a real DB for production.

Setup (local):
1. cd frontend
2. cp .env.example .env and add OPENAI_API_KEY (or leave empty to use mock responses)
3. npm install
4. npm run dev

Open http://localhost:3000

Google Calendar integration is scaffolded as a next step but not enabled in this prototype; see TODOs in the README.
