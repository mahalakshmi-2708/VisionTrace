from fastapi import APIRouter, Depends, HTTPException

from services.analytics_service import alerts_for_session, dashboard_summary, traffic_stats
from utils.dependencies import get_current_user

router = APIRouter()


def clean_document(document: dict) -> dict:
    document.pop("_id", None)
    return document


@router.get("/dashboard-summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    return await dashboard_summary(current_user)


@router.get("/traffic-stats/{session_id}")
async def get_traffic_stats(session_id: str, current_user: dict = Depends(get_current_user)):
    stats = await traffic_stats(session_id, current_user)
    if not stats:
        raise HTTPException(status_code=404, detail="Traffic stats not found")
    return clean_document(stats)


@router.get("/alerts/{session_id}")
async def get_alerts(session_id: str, current_user: dict = Depends(get_current_user)):
    alerts = await alerts_for_session(session_id, current_user)
    return [clean_document(alert) for alert in alerts]
