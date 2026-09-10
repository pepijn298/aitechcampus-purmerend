# AI Tech Campus - Starter Prototype

Public repository for the AI Tech Campus Purmerend prototype.

This scaffold now includes:
- Next.js frontend (pages: /, /admin, chat widget)
- NextAuth for authentication (Credentials + Google)
- Google Calendar integration: users can connect Google to allow calendar event creation on approval
- Chat widget proxy to OpenAI (set OPENAI_API_KEY in .env or GitHub Secrets)
- Requests API with approval workflow; approved requests attempt to create events in the requester's Google Calendar if they connected their account
- Docker Compose for local dev

Important security notes (read before using with real data):
- Do NOT commit real credentials into the repo.
- This is a prototype: tokens are stored in data/tokens.json and requests in data/requests.json (file-backed). Replace with a secure DB and encrypted secrets for production.
- Add NEXTAUTH_SECRET and proper OAuth client credentials in environment for Google integration.

Environment variables (see .env.example):
- OPENAI_API_KEY - API key for OpenAI (optional for demo)
- NEXTAUTH_URL - URL for NextAuth callbacks (default http://localhost:3000)
- NEXTAUTH_SECRET - random secret for NextAuth
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET - for Google OAuth
- ADMIN_EMAIL / ADMIN_PASSWORD - seeded admin credentials for demo

How to run locally
1. Copy .env.example -> .env and fill values (especially NEXTAUTH_SECRET and optionally OPENAI_API_KEY and Google creds)
2. cd frontend
3. npm install
4. npm run dev
5. Open http://localhost:3000

Sign-in flow
- Use "Sign in" in chat or admin page. You can sign in with Google (connects calendar) or use Credentials provider with the ADMIN_EMAIL/ADMIN_PASSWORD from .env to access admin pages.

Notes on Calendar integration
- Users who sign in with Google will have their tokens persisted (demo: in data/tokens.json). When an admin approves a request, the server will attempt to create a calendar event in the requester's primary calendar.

Next steps for production hardening
- Replace file-backed storage with Postgres.
- Use Vault or cloud secrets manager for sensitive keys.
- Add RBAC and audit logging to a secure logging service.
- Add CSRF protection, rate limiting and input validation.

