# Multi-Agent Compliance AI

A multi-agent compliance AI system orchestrated via LangGraph, surfaced through a web UI for report review and monitoring.

## Project Overview

The stack consists of:
- **Frontend**: React (v18.x) + Redux Toolkit application
- **Backend**: FastAPI (v0.115.12) microservices
- **Datastore & Vector Store**: Supabase (hosted PostgreSQL + pgvector extension + Unix cron jobs)
- **Orchestration**: LangGraph Python SDK
- **Task Scheduling**: Unix cron jobs invoking shell scripts that call FastAPI endpoints

## Repository Structure

```
repo-root/
├── frontend/                  # React + Redux Toolkit app
│   ├── src/
│       ├── components/        # shadcn/ui + custom
│       ├── hooks/             # e.g. useSupabaseClient()
│       ├── pages/             # React Router routes
│       ├── services/          # Axios clients for FastAPI endpoints
│       ├── store/             # Redux Toolkit slices
│       ├── App.tsx
│       └── main.tsx
├── backend/                   # FastAPI microservices
│   ├── app/
│   │   ├── main.py            # Uvicorn entrypoint
│   │   ├── api/               # reg_intel.py, impact.py, planner.py, report.py
│   │   ├── core/              # settings.py, supabase_client.py
│   │   └── langgraph/         # pipeline definitions
│   └── requirements.txt       # pinned dependencies
└── scripts/                   # shell scripts + cron examples
```

## Setup & Running

### Backend

1. Create a `.env` file in the `backend` directory:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
```

2. Run the API server:

```bash
./scripts/run_api.sh
```

This will:
- Create a Python virtual environment if it doesn't exist
- Install dependencies
- Start the FastAPI server on http://localhost:8000

### Frontend

1. Create a `.env.local` file in the `frontend` directory:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

2. Install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000

## Pipeline Execution

To run the compliance pipeline manually:

```bash
./scripts/run_pipeline.sh
```

For scheduled execution, set up cron jobs:

```bash
crontab scripts/schedule_cron.txt
```

## API Endpoints

- `/reg-intel`: Regulatory intelligence agent
- `/impact`: Financial impact assessment agent
- `/planner`: Implementation planning agent
- `/report`: Report generation service

## Agents

The system consists of three GPT-4o agents orchestrated via LangGraph:

1. **Regulatory Intelligence**: Scrapes regulatory information
2. **Financial Impact Assessment**: Analyzes impact on business
3. **Implementation Planning**: Creates action plans and timelines