-- Create schema
CREATE SCHEMA IF NOT EXISTS dev;
SET search_path TO dev;

-- Create user
CREATE USER user05 WITH PASSWORD 'Forest@21163';
GRANT ALL PRIVILEGES ON DATABASE smartoptions TO user05;
GRANT USAGE, CREATE ON SCHEMA dev TO user05;


-- Users table
CREATE TABLE dev.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stocks table
CREATE TABLE dev.stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    company_name VARCHAR(150),
    exchange VARCHAR(50),
    sector VARCHAR(100),
    last_price DECIMAL(10, 2),
    volume BIGINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options Chain table
CREATE TABLE dev.options_chain (
    id SERIAL PRIMARY KEY,
    stock_id INT REFERENCES dev.stocks(id) ON DELETE CASCADE,
    option_type VARCHAR(10) CHECK (option_type IN ('CALL', 'PUT')),
    strike_price DECIMAL(10, 2),
    expiry_date DATE,
    last_price DECIMAL(10, 2),
    bid DECIMAL(10, 2),
    ask DECIMAL(10, 2),
    implied_volatility DECIMAL(6, 3),
    delta DECIMAL(6, 3),
    gamma DECIMAL(6, 3),
    theta DECIMAL(6, 3),
    vega DECIMAL(6, 3),
    rho DECIMAL(6, 3),
    open_interest BIGINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Strategy Templates table
CREATE TABLE dev.strategy_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    risk_level VARCHAR(20),
    max_profit DECIMAL(12, 2),
    max_loss DECIMAL(12, 2),
    breakeven_points TEXT,
    created_by INT REFERENCES dev.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Strategies table
CREATE TABLE dev.user_strategies (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES dev.users(id) ON DELETE CASCADE,
    stock_id INT REFERENCES dev.stocks(id),
    strategy_template_id INT REFERENCES dev.strategy_templates(id),
    custom_leg_count INT,
    expected_profit DECIMAL(12, 2),
    expected_loss DECIMAL(12, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Strategy Legs table
CREATE TABLE dev.strategy_legs (
    id SERIAL PRIMARY KEY,
    user_strategy_id INT REFERENCES dev.user_strategies(id) ON DELETE CASCADE,
    leg_type VARCHAR(20) CHECK (leg_type IN ('BUY', 'SELL')),
    option_type VARCHAR(10) CHECK (option_type IN ('CALL', 'PUT')),
    strike_price DECIMAL(10, 2),
    expiry_date DATE,
    quantity INT,
    premium DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market News table
CREATE TABLE dev.market_news (
    id SERIAL PRIMARY KEY,
    stock_symbol VARCHAR(10),
    headline TEXT,
    source VARCHAR(100),
    published_at TIMESTAMP,
    url TEXT
);

-- Alerts table
CREATE TABLE dev.alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES dev.users(id),
    stock_id INT REFERENCES dev.stocks(id),
    alert_type VARCHAR(50) CHECK (alert_type IN ('PRICE', 'IV', 'VOLUME')),
    condition TEXT,
    triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watchlist table
CREATE TABLE dev.watchlists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES dev.users(id) ON DELETE CASCADE,
    stock_id INT REFERENCES dev.stocks(id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, stock_id)
);