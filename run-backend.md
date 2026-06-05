# How to Run Django Backend Locally

## Prerequisites
1. **Python 3.8+** installed
2. No external database is required. The backend uses SQLite by default.
3. Redis is optional for background workers; basic API usage does not require it.

## Quick Setup

### 1. Navigate to Backend Directory
```bash
cd c:\Personal\projects\SmartOptions\backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup Local Database
SQLite is configured by default and Django creates the database file when migrations run.

### 5. Configure Environment
The project reads `.env` from the repository root. For local development:
- Database engine: `sqlite`
- Database file: `backend/db.sqlite3`

PostgreSQL is still supported if you explicitly set `DB_ENGINE=postgres` and provide the usual `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_PORT` values.

### 6. Run Migrations
```bash
python manage.py migrate
```

### 7. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 8. Start Development Server
```bash
python manage.py runserver
```

## Access Points
- **API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **Swagger UI**: http://localhost:8000/swagger/
- **API Documentation**: http://localhost:8000/redoc/

## API Endpoints
- **Authentication**: `/api/auth/`
- **Strategies**: `/api/strategies/`
- **Options**: `/api/options/`
- **Alerts**: `/api/alerts/`
- **Analytics**: `/api/analytics/`

## Troubleshooting

### Database Connection Issues
1. Check `DB_ENGINE` in `.env`
2. For SQLite, delete `backend/db.sqlite3` and rerun migrations if the local database gets corrupted
3. For PostgreSQL, verify the host, credentials, and database name

### Missing Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Redis Connection (Optional)
If you need Celery tasks, start Redis:
```bash
# Windows (if Redis installed)
redis-server

# Or use Docker
docker run -d -p 6379:6379 redis:alpine
```

## Development Notes
- The backend uses JWT authentication
- CORS is enabled for all origins in development
- Debug mode is enabled by default
- Static files served at `/static/`
