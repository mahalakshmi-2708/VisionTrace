from database.mongodb import get_database


async def dashboard_summary(user: dict) -> dict:
    database = get_database()
    user_id = str(user["_id"])
    sessions = [session async for session in database.sessions.find({"user_id": user_id})]
    session_ids = [session["session_id"] for session in sessions]
    stats = [item async for item in database.traffic_stats.find({"session_id": {"$in": session_ids}})]
    alerts = [item async for item in database.alerts.find({"session_id": {"$in": session_ids}})]

    totals = {
        "totalVehicles": sum(item.get("total_vehicle", 0) for item in stats),
        "cars": sum(item.get("cars", 0) for item in stats),
        "motorcycles": sum(item.get("motorcycles", 0) for item in stats),
        "trucks": sum(item.get("trucks", 0) for item in stats),
        "buses": sum(item.get("buses", 0) for item in stats),
        "totalAlerts": len(alerts),
        "processedVideos": len([session for session in sessions if session.get("status") == "completed"]),
    }

    vehicle_chart = [
        {
            "session": session_id[:8],
            "vehicles": next((item.get("total_vehicle", 0) for item in stats if item["session_id"] == session_id), 0),
        }
        for session_id in session_ids
    ]
    type_distribution = [
        {"name": "Cars", "value": totals["cars"]},
        {"name": "Motorcycles", "value": totals["motorcycles"]},
        {"name": "Buses", "value": totals["buses"]},
        {"name": "Trucks", "value": totals["trucks"]},
    ]
    density_chart = [
        {"level": level, "count": len([item for item in stats if item.get("density_level") == level])}
        for level in ["Low", "Medium", "High"]
    ]
    alert_distribution = [
        {"severity": severity.title(), "count": len([alert for alert in alerts if alert.get("severity") == severity])}
        for severity in ["info", "warning", "critical"]
    ]

    return {
        "stats": totals,
        "vehicleChart": vehicle_chart,
        "typeDistribution": type_distribution,
        "densityChart": density_chart,
        "alertDistribution": alert_distribution,
    }


async def traffic_stats(session_id: str, user: dict) -> dict | None:
    database = get_database()
    session = await database.sessions.find_one({"session_id": session_id, "user_id": str(user["_id"])})
    if not session:
        return None
    return await database.traffic_stats.find_one({"session_id": session_id})


async def alerts_for_session(session_id: str, user: dict) -> list[dict]:
    database = get_database()
    session = await database.sessions.find_one({"session_id": session_id, "user_id": str(user["_id"])})
    if not session:
        return []
    return [alert async for alert in database.alerts.find({"session_id": session_id}).sort("timestamp", -1)]
