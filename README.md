# reactFlow

VectorShift-inspired pipeline editor built with React Flow, Zustand, Ant Design, and FastAPI.

## Structure

- `frontend/` - React app (canvas, node palette, Run Pipeline)
- `backend/` - FastAPI service (`POST /pipelines/parse`)
- `docs/IMPLEMENTATION.md` - detailed guide for all 4 assessment parts (with diagrams)

## Assessment parts

| Part | Summary |
|------|---------|
| **1 - Node abstraction** | `createNode` factory + registry; 5 new demo nodes |
| **2 - Styling** | VectorShift-inspired UI via Ant Design + design tokens |
| **3 - Text node** | Auto-resize + `{{ variable }}` dynamic handles |
| **4 - Backend** | Run Pipeline -> DAG validation modal |

See **[docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md)** for architecture diagrams, file maps, and part-by-part breakdown.

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
