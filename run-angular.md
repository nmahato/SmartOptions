# How to Run Angular Frontend

## Option 1: Docker (Recommended)
```bash
# Navigate to project directory
cd c:\Personal\projects\SmartOptions

# Start Angular frontend
docker-compose up --build angular-frontend
```

## Option 2: Local Development
```bash
# Navigate to Angular directory
cd c:\Personal\projects\SmartOptions\angular-frontend

# Install dependencies
npm install --force

# Start development server
ng serve --host 0.0.0.0 --port 4200
```

## Option 3: Direct npm start
```bash
cd c:\Personal\projects\SmartOptions\angular-frontend
npm start
```

## Access the Application
- **Angular Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/swagger/

## Features Available
- ✅ Login page with backend authentication
- ✅ Dashboard with strategy overview
- ✅ Strategy builder for creating options strategies
- ✅ Direct links to Swagger UI and Admin panel
- ✅ Responsive design with modern Angular 17

## Troubleshooting
If Docker build fails, try:
```bash
docker-compose build --no-cache angular-frontend
```

For local development issues:
```bash
npm cache clean --force
npm install --force
```