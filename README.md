# VisionTrace - AI Powered Smart Traffic Monitoring System

VisionTrace is an internship-level full-stack project for analyzing uploaded traffic videos with YOLOv8. It detects cars, motorcycles, buses, and trucks, stores session analytics in MongoDB Atlas, and presents results in a professional React dashboard.

## Features

- User registration, login, logout, JWT authentication, and password hashing
- MP4 traffic video upload with progress display and unique session IDs
- YOLOv8 + OpenCV video processing for selected vehicle classes
- Traffic analytics with vehicle totals, type counts, and density level
- Alert generation for high traffic density and count threshold breaches
- Dashboard cards, charts, session history, analytics, and alerts pages
- Responsive UI with dark/light mode
- REST API documentation through FastAPI Swagger at `/docs`

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts, Axios
- Backend: FastAPI, Python, JWT, Passlib
- Database: MongoDB Atlas
- AI/CV: OpenCV, Ultralytics YOLOv8

## Project Structure

```text
VisionTrace/
  backend/
    main.py
    database/
    models/
    routes/
    services/
    utils/
  frontend/
    src/
      api/
      charts/
      components/
      context/
      pages/
  models/
  uploads/
  processed_videos/
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example ..\.env
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## MongoDB Atlas Configuration

1. Create a MongoDB Atlas cluster.
2. Create a database user with read/write permissions.
3. Add your IP address to Network Access.
4. Copy the connection string and place it in the root `.env` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/visiontrace?retryWrites=true&w=majority
DATABASE_NAME=visiontrace
JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS_RAW=http://localhost:5173,http://127.0.0.1:5173
YOLO_MODEL_PATH=yolov8n.pt
VEHICLE_COUNT_ALERT_THRESHOLD=30
```

Collections used by the project:

- `users`: name, email, password_hash, created_at
- `sessions`: session_id, user_id, filename, upload_time, status, processed_frames
- `traffic_stats`: session_id, total_vehicle, cars, motorcycles, buses, trucks, density_level
- `alerts`: session_id, alert_type, message, severity, timestamp, status

## Required API Endpoints

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Video:

- `POST /api/video/upload`
- `POST /api/video/start-processing/{session_id}`
- `GET /api/video/session/{session_id}`
- `GET /api/video/sessions`

Analytics:

- `GET /api/analytics/dashboard-summary`
- `GET /api/analytics/traffic-stats/{session_id}`
- `GET /api/analytics/alerts/{session_id}`

## YOLOv8 Notes

The backend uses `yolov8n.pt` by default. Ultralytics downloads it automatically the first time processing runs if the model is not already available. For offline evaluation, download `yolov8n.pt` manually and set `YOLO_MODEL_PATH` to its local path.

Traffic density is intentionally simple:

- Low: fewer than 12 detected vehicles
- Medium: 12 to 29 detected vehicles
- High: 30 or more detected vehicles

## Internship Scope

This project intentionally avoids real-time CCTV streaming, microservices, cloud deployment, license plate recognition, face recognition, advanced tracking algorithms, and complex role management.
