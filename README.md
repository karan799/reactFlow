# reactFlow

VectorShift-inspired pipeline editor built with React Flow, Zustand, Ant Design, and FastAPI.

## Structure

- `frontend/` — React app (canvas, node palette, Run Pipeline)
- `backend/` — FastAPI service (`POST /pipelines/parse`)

## Run locally

```bash
# Backend (port 8000)
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8000

# Frontend (port 3000)
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000), build a pipeline, then click **Run Pipeline**.
