import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.scanner import run_scan
from backend.storage import load_latest_scan_results

app = FastAPI()

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
latest_scan = None


def get_current_scan():
    global latest_scan
    if latest_scan is None:
        latest_scan = load_latest_scan_results()
    return latest_scan


@app.get("/scan")
def scan():
    global latest_scan

    latest_scan = run_scan()

    return latest_scan


@app.get("/instances")
def instances():
    scan_data = get_current_scan()
    if scan_data is None:
        return {"instances": []}

    return {"instances": scan_data["instances"]}


@app.get("/buckets")
def buckets():
    scan_data = get_current_scan()
    if scan_data is None:
        return {"buckets": []}

    return {"buckets": scan_data["buckets"]}


@app.get("/cis-results")
def cis_results():
    scan_data = get_current_scan()
    if scan_data is None:
        return {
            "summary": {
                "total": 0,
                "passed": 0,
                "failed": 0,
            },
            "findings": [],
        }

    return {
        "summary": scan_data["summary"],
        "findings": scan_data["findings"],
    }