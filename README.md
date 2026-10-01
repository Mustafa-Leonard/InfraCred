# InfraCred - Infrastructure Community Reporting Platform

InfraCred is a robust, community-driven platform designed to support the reporting and tracking of infrastructure-related problems. It empowers citizens to report issues like road damage, water failures, and public safety hazards, while providing authorities with tools to manage and resolve these issues efficiently using data clustering and spatial analysis.

## 🚀 Key Features

### Citizen Side
- **Report Issue**: Interactive map-based reporting for 7+ categories of infrastructure damage.
- **My Reports**: Personal dashboard to track the lifecycle of submitted reports.
- **Nearby Reports**: Geographic view of all active issues in the vicinity.
- **Confirm Problems**: Community-driven validation to help authorities prioritize urgent clusters.

### Authority Side
- **Cluster List**: Smart grouping of individual reports into actionable clusters.
- **Map View**: Spatial overview of infrastructure health across jurisdictions.
- **Status Management**: Mark issues as Investigating, In Progress, or Resolved.
- **Exporting**: Generate summary reports for maintenance planning.

### Admin Side
- Manage **Infrastructure Types** and **Categories**.
- Configure **Jurisdictions** (Spatial boundaries).
- Manage **Authorities** and their assignments.

## 🛠️ Technology Stack

- **Frontend**: React (Vite, TypeScript), Material UI (MUI), Leaflet (Maps), TanStack Query, Zustand.
- **Backend**: Django & Django Rest Framework, GeoDjango (Spatial data), Simple JWT (Auth), Celery & Redis (Async tasks).
- **Database**: PostgreSQL with PostGIS extension.
- **DevOps**: Docker, Docker Compose.

## 📁 Infrastructure Categories Supported

1. **Road & Transport**: Potholes, collapsed sections, damaged bridges.
2. **Water & Sanitation**: Burst pipes, sewage overflow, blocked drainage.
3. **Electricity**: Power outages, fallen lines, broken street-lights.
4. **Solid Waste**: Illegal dumping, uncollected garbage.
5. **Public Facilities**: Damaged schools, hospitals, public toilets.
6. **Flooding & Drainage**: Flooded roads, blocked culverts.
7. **Public Safety**: Uncovered trenches, collapsing buildings.

## 📦 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Installation
1. Clone the repository.
2. Start the database and Redis with `docker compose up -d db redis`.
3. Apply database migrations with `docker compose run --rm backend python manage.py migrate --noinput`.
4. Start the application with `docker compose up --build`.
5. Access the frontend at `http://localhost:3000`.
6. Access the API documentation at `http://localhost:8000/api/docs/`.

Password-reset emails use the console backend by default and print their one-time link in the backend output. For real email delivery, configure `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, `DEFAULT_FROM_EMAIL`, and `FRONTEND_URL` in the environment.

## 📄 License
MIT License
