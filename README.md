# SmartOptions - Options Strategy Builder & Flow Analytics

A containerized, full-stack trading analytics platform for designing, visualizing, and optimizing multi-leg options strategies.

## Features

- **Options Strategy Builder**: Design and visualize multi-leg options strategies
- **Payoff Diagrams**: Interactive charts showing profit/loss across price ranges
- **Greeks Calculation**: Compute Delta, Gamma, Theta, Vega, Rho
- **Options Flow Analytics**: Track unusual options activity
- **Backtesting**: Simulate strategy performance on historical data
- **Alerts & Notifications**: Real-time alerts for strategy conditions
- **User Authentication**: Secure JWT-based authentication

## Tech Stack

- **Backend**: Django REST Framework, PostgreSQL, Redis, Celery
- **Frontend**: Angular 17
- **Containerization**: Docker Compose
- **Deployment**: Cloud-ready (Render, AWS, Azure)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartOptions
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:4200
   - Admin Panel: http://localhost:8000/admin

## Development Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd angular-frontend
npm install
npm start
```

### Production Build
```bash
cd angular-frontend
npm run build
# Build output: dist/smartoptions-angular/
```

## API Endpoints

- **Authentication**: `/api/auth/`
- **Options Data**: `/api/options/`
- **Strategies**: `/api/strategies/`
- **Alerts**: `/api/alerts/`
- **Analytics**: `/api/analytics/`

## Database Schema

The application uses PostgreSQL with the following main tables:
- Users (authentication)
- Stocks (market data)
- OptionsChain (options data with Greeks)
- UserStrategies (user-created strategies)
- StrategyLegs (individual option positions)
- Alerts (user notifications)
- FlowData (unusual options activity)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.