# SmartOptions v1.0.0 - Deployment Build

Production-ready deployment package including backend, frontend build, and Docker configuration.

## Includes:
- Backend (Django REST Framework)
- Frontend (Angular 17 production build)
- Docker Compose configuration
- Dockerfiles for both services
- Database migrations

## To Deploy:
1. Extract the ZIP file
2. Run: `docker-compose up --build`
3. Access the application at http://localhost:8000 (API) and http://localhost:4200 (Frontend)

## Features:
- Options Strategy Builder with interactive payoff diagrams
- Greeks calculation (Delta, Gamma, Theta, Vega, Rho)
- Options Flow Analytics
- User authentication with JWT
- Real-time alerts and notifications
- Backtesting capabilities
