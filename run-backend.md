# How to Run Django Backend Locally

## Prerequisites
1. **Python 3.8+** installed
2. **PostgreSQL** running locally
3. **Redis** running locally (optional for basic functionality)

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
Make sure PostgreSQL is running and create the database if it does not already exist:
```sql
CREATE DATABASE smartoptions;
```

### 5. Configure Environment
The project reads `.env` from the repository root. For local development:
- Database: `smartoptions` on `localhost:5432`
- User: `postgres`
- Update `DB_PASSWORD` in `.env` if needed

If you use the Docker Compose Postgres service, keep the container database port at `5432` and connect from the host through `localhost:5433`.

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
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database `smartoptions` exists

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
