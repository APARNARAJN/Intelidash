# IntelliDash — AI-Powered Business Intelligence Platform

A fullstack BI platform that converts plain English questions into interactive data visualizations using a local LLM — no SQL knowledge required.

> "Show me total revenue by region" → generates SQL → queries PostgreSQL → renders a bar chart. Instantly.

---

## Features

- **Natural Language to SQL** — Type a question in plain English, get a chart
- **AI-Powered Query Engine** — Uses Ollama (LLaMA 3.2) running locally for privacy
- **Interactive Charts** — Bar and line charts powered by Recharts
- **Microservices Architecture** — Decoupled Node.js backend and Python AI service
- **Real Data** — PostgreSQL database with sales data across regions and products

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Recharts, React Router |
| Backend | Node.js, Express |
| AI Service | Python, FastAPI, LangChain, Ollama (LLaMA 3.2) |
| Database | PostgreSQL |

---

## Architecture

```
React Frontend (port 5173)
        ↓  plain English question
Express Backend (port 5000)
        ↓  forwards to AI service
FastAPI + Ollama (port 8000)
        ↓  generates SQL
PostgreSQL (port 5432)
        ↓  returns data
Recharts renders chart
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- PostgreSQL
- [Ollama](https://ollama.com) with `llama3.2` pulled

```bash
ollama pull llama3.2
```

### 1. Clone the repo
```bash
git clone https://github.com/APARNARAJN/Intelidash.git
cd Intelidash
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=intellidash
PG_USER=postgres
PG_PASSWORD=your_password_here
```

Seed the database:
```bash
node seed.js
```

Start the server:
```bash
npm run dev
```

### 3. Set up the AI service
```bash
cd ai_service
python -m venv inteli
inteli\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Start the frontend
```bash
cd ..
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Example Queries

- "Show total revenue by region"
- "Monthly revenue trend"
- "Top products by revenue"
- "Sales by category"
- "Revenue in the North region"

---

## Project Structure

```
intelidash/
├── src/                  # React frontend
│   ├── Dashboard.jsx     # Main dashboard with AI chat + charts
│   ├── DataSources.jsx   # Uploaded data sources
│   ├── Report.jsx        # Reports page
│   └── Layout.jsx        # Shared navbar layout
├── server/               # Node.js + Express backend
│   ├── routes/
│   │   └── ai.routes.js  # /api/ai/ask endpoint
│   ├── db/
│   │   └── postgres.js   # PostgreSQL connection pool
│   ├── seed.js           # Database seeder
│   └── server.js         # Entry point
└── ai_service/           # Python FastAPI microservice
    └── main.py           # NL → SQL generation via Ollama
```

---

## How the NL→SQL Works

1. User types a plain English question
2. FastAPI receives the question and injects the database schema into a system prompt
3. Ollama (LLaMA 3.2) generates a PostgreSQL SELECT query
4. The query is validated (no destructive operations allowed)
5. Express runs the query against PostgreSQL
6. Results are returned to React and rendered as a Recharts chart

---

## Author

**Aparna Raj** — [GitHub](https://github.com/APARNARAJN) · [LinkedIn](https://linkedin.com/in/your-profile)
