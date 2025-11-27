# Video Copy Tool — Copy-Analyze-Rewrite -> Prompt VEo3
This bundle contains a ready-to-deploy Node.js backend and a React frontend component.

## What's included
- backend: server.js
- helpers: helpers/openai.js, helpers/youtube.js
- frontend: src/components/VideoCopyTool.jsx (React single-file component)
- package.json
- .env.example
- Dockerfile
- docker-compose.yml
- README.md (this file)

## Quick start (Render / local)
1. Copy `.env.example` to `.env` and fill OPENAI_API_KEY.
2. `npm install`
3. `npm start`
4. Visit your frontend (deploy as static or integrate with your app).

## Notes for non-technical users
- If you want 1-click deploy, follow the Render instructions in the chat (I can provide step-by-step with screenshots).
- Do NOT commit your `.env` file with your API key.
