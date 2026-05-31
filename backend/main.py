"""VectorShift Pipeline Backend.

A tiny FastAPI service that accepts a pipeline payload (the nodes and edges
produced by the React Flow editor) and answers three questions about it:

  * how many nodes does it contain,
  * how many edges does it contain, and
  * is the underlying graph a DAG (Directed Acyclic Graph)?

DAG detection uses Kahn's algorithm (iterative topological sort) which is
O(V + E) and stack-safe regardless of pipeline depth.
"""

from collections import defaultdict, deque
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# --------------------------------------------------------------------------- #
# Schemas
# --------------------------------------------------------------------------- #


class PipelineNode(BaseModel):
    """A node as serialised by React Flow.

    We accept arbitrary extra fields (position, data, etc.) because we only
    need `id` to compute node/edge counts and DAG-ness. Everything else is
    untouched and can grow without breaking the contract.
    """

    id: str

    model_config = {"extra": "allow"}


class PipelineEdge(BaseModel):
    """A React Flow edge. `source` and `target` reference node ids."""

    id: str | None = None
    source: str
    target: str

    model_config = {"extra": "allow"}


class Pipeline(BaseModel):
    nodes: list[PipelineNode] = Field(default_factory=list)
    edges: list[PipelineEdge] = Field(default_factory=list)


class PipelineSummary(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


# --------------------------------------------------------------------------- #
# App
# --------------------------------------------------------------------------- #


app = FastAPI(title="VectorShift Pipeline API", version="1.0.0")

# CRA dev server runs on a different origin (localhost:3000). Open CORS up
# for local development; tighten allow_origins in production deployments.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"Ping": "Pong"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# --------------------------------------------------------------------------- #
# Core logic
# --------------------------------------------------------------------------- #


def is_directed_acyclic_graph(
    node_ids: list[str], edges: list[PipelineEdge]
) -> bool:
    """Return True iff the graph defined by `node_ids` and `edges` is a DAG.

    Implementation: Kahn's algorithm. We repeatedly remove nodes whose
    in-degree is zero, decrementing the in-degree of their successors. If we
    successfully remove every node, the graph is a DAG; if any node never
    reaches in-degree zero, those nodes participate in a cycle.

    Edges that reference unknown nodes are ignored (defensive: the frontend
    should never send these, but we don't want to crash on a malformed
    payload). Self-loops are naturally classified as cycles because the
    referenced node's in-degree never reaches zero.
    """
    valid_nodes = set(node_ids)
    in_degree: dict[str, int] = {nid: 0 for nid in valid_nodes}
    adjacency: dict[str, list[str]] = defaultdict(list)

    for edge in edges:
        if edge.source not in valid_nodes or edge.target not in valid_nodes:
            continue
        adjacency[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    queue: deque[str] = deque(nid for nid, deg in in_degree.items() if deg == 0)
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for successor in adjacency[node]:
            in_degree[successor] -= 1
            if in_degree[successor] == 0:
                queue.append(successor)

    return visited == len(valid_nodes)


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #


@app.post("/pipelines/parse", response_model=PipelineSummary)
def parse_pipeline(pipeline: Pipeline) -> PipelineSummary:
    node_ids = [n.id for n in pipeline.nodes]
    return PipelineSummary(
        num_nodes=len(pipeline.nodes),
        num_edges=len(pipeline.edges),
        is_dag=is_directed_acyclic_graph(node_ids, pipeline.edges),
    )


# Kept for backwards compatibility with the original scaffold.
@app.get("/pipelines/parse")
def parse_pipeline_legacy() -> dict[str, Any]:
    return {"status": "parsed"}
