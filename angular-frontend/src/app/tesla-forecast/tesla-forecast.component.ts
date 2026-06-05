import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ForecastPoint {
  time: string;
  price: number;
  upper: number;
  lower: number;
}

interface Scenario {
  label: string;
  probability: string;
  range: string;
  summary: string;
}

@Component({
  selector: 'app-tesla-forecast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forecast-page">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="navbar-brand">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L3 8.5L12 14L21 8.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M4 14L12 19L20 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              SmartOptions
            </div>
            <button class="btn btn-secondary" type="button" (click)="goDashboard()">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 11L12 4L21 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 10.5V20H19V10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main class="container">
        <section class="forecast-hero">
          <div>
            <p class="eyebrow">TSLA intraday model</p>
            <h1 class="page-title">Tesla Stock Forecast</h1>
            <p class="page-subtitle">
              A transparent same-day forecast built from premarket price action, options-implied range,
              max-pain positioning, and current news catalysts.
            </p>
          </div>
          <div class="prediction-panel">
            <span class="panel-label">Model close target</span>
            <strong>{{ formatCurrency(modelTarget) }}</strong>
            <span class="panel-footnote">Generated {{ generatedAt }}</span>
          </div>
        </section>

        <section class="metric-grid">
          <div class="metric-card">
            <span>Premarket snapshot</span>
            <strong>{{ formatCurrency(currentPrice) }}</strong>
            <small>Bid {{ formatCurrency(bidPrice) }} / ask {{ formatCurrency(askPrice) }}</small>
          </div>
          <div class="metric-card">
            <span>Prior close</span>
            <strong>{{ formatCurrency(previousClose) }}</strong>
            <small>{{ previousCloseDate }}</small>
          </div>
          <div class="metric-card">
            <span>Options-implied move</span>
            <strong>+/- {{ formatCurrency(expectedMove) }}</strong>
            <small>Jun 5 expiration, about {{ expectedMovePercent }}%</small>
          </div>
          <div class="metric-card">
            <span>Key magnet</span>
            <strong>{{ formatCurrency(maxPain) }}</strong>
            <small>Same-day max pain</small>
          </div>
        </section>

        <section class="card chart-card">
          <div class="chart-header">
            <div>
              <h2>Projected Price Path</h2>
              <p>Base path with the options-implied range as the risk band.</p>
            </div>
            <div class="bias-pill">Slight bullish bias</div>
          </div>

          <div class="chart-wrap" role="img" aria-label="Tesla projected intraday price path">
            <svg viewBox="0 0 920 380" preserveAspectRatio="none">
              <g class="grid-lines">
                <line *ngFor="let tick of yTicks" x1="64" x2="884" [attr.y1]="y(tick)" [attr.y2]="y(tick)" />
              </g>
              <g class="axis-labels">
                <text *ngFor="let tick of yTicks" x="16" [attr.y]="y(tick) + 4">{{ formatCurrency(tick) }}</text>
                <text *ngFor="let point of forecastPoints; let i = index" [attr.x]="x(i) - 18" y="356">{{ point.time }}</text>
              </g>
              <path class="range-band" [attr.d]="bandPath()"></path>
              <path class="target-line" [attr.d]="linePath('price')"></path>
              <line class="reference-line" x1="64" x2="884" [attr.y1]="y(maxPain)" [attr.y2]="y(maxPain)" />
              <text class="reference-label" x="742" [attr.y]="y(maxPain) - 8">Max pain {{ formatCurrency(maxPain) }}</text>
              <g *ngFor="let point of forecastPoints; let i = index">
                <circle class="point" [attr.cx]="x(i)" [attr.cy]="y(point.price)" r="5"></circle>
              </g>
            </svg>
          </div>
        </section>

        <section class="analysis-grid">
          <div class="card model-card">
            <h2>Model Read</h2>
            <p>
              The model's base case is a close near {{ formatCurrency(modelTarget) }}, with a practical
              trading range of {{ formatCurrency(dayLow) }} to {{ formatCurrency(dayHigh) }}. The edge is
              modest: the price is above the prior close, call volume is leading put volume, and the JPMorgan
              upgrade is a positive catalyst, but the {{ formatCurrency(maxPain) }} strike can pull price action
              back toward the center into expiration.
            </p>
            <div class="decision-strip">
              <div>
                <span>Above {{ formatCurrency(bullishTrigger) }}</span>
                <strong>Upside continuation</strong>
              </div>
              <div>
                <span>Below {{ formatCurrency(bearishTrigger) }}</span>
                <strong>Bearish invalidation</strong>
              </div>
            </div>
          </div>

          <div class="card scenario-card">
            <h2>Scenarios</h2>
            <div class="scenario-row" *ngFor="let scenario of scenarios">
              <div>
                <strong>{{ scenario.label }}</strong>
                <span>{{ scenario.summary }}</span>
              </div>
              <div class="scenario-meta">
                <b>{{ scenario.probability }}</b>
                <small>{{ scenario.range }}</small>
              </div>
            </div>
          </div>
        </section>

        <section class="card notes-card">
          <h2>Sources And Limits</h2>
          <p>
            Inputs: Robinhood TSLA quote snapshot, Jun 5 option-chain statistics from Stocknear and
            ChartExchange, plus the Reuters report on JPMorgan's Tesla upgrade. This is an informational
            forecast, not financial advice or an automated trading signal.
          </p>
          <div class="source-links">
            <a href="https://stocknear.com/stocks/TSLA/options" target="_blank" rel="noreferrer">Stocknear options data</a>
            <a href="https://chartexchange.com/symbol/nasdaq-tsla/optionchain/?date=20260605" target="_blank" rel="noreferrer">ChartExchange chain</a>
            <a href="https://uk.marketscreener.com/news/jp-morgan-upgrades-tesla-to-neutral-sees-robotics-driving-long-term-growth-ce7f5ddddc8df622" target="_blank" rel="noreferrer">Reuters catalyst</a>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .forecast-page {
      min-height: 100vh;
      color: #1f2937;
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 28px;
      height: 28px;
      color: #667eea;
    }

    .forecast-hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 280px;
      gap: 24px;
      align-items: end;
      margin-bottom: 24px;
    }

    .eyebrow {
      color: #0f766e;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .page-title {
      color: #111827;
      font-size: 44px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1.05;
      margin-bottom: 12px;
    }

    .page-subtitle {
      color: #4b5563;
      font-size: 17px;
      max-width: 760px;
      margin: 0;
    }

    .prediction-panel {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 8px;
      color: #fff;
      padding: 20px;
      min-height: 156px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
    }

    .panel-label,
    .panel-footnote {
      color: #cbd5e1;
      font-size: 13px;
      font-weight: 600;
    }

    .prediction-panel strong {
      color: #5eead4;
      font-size: 42px;
      line-height: 1;
      margin: 12px 0;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(15, 23, 42, 0.08);
      border-radius: 8px;
      padding: 18px;
      min-height: 128px;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    }

    .metric-card span,
    .metric-card small {
      color: #64748b;
      display: block;
      font-size: 13px;
      font-weight: 600;
    }

    .metric-card strong {
      color: #0f172a;
      display: block;
      font-size: 28px;
      margin: 10px 0 6px;
      white-space: nowrap;
    }

    .chart-card,
    .model-card,
    .scenario-card,
    .notes-card {
      border-radius: 8px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 18px;
    }

    .chart-header h2,
    .model-card h2,
    .scenario-card h2,
    .notes-card h2 {
      color: #111827;
      font-size: 22px;
      line-height: 1.2;
      margin: 0 0 6px;
    }

    .chart-header p,
    .model-card p,
    .notes-card p {
      color: #4b5563;
      margin: 0;
    }

    .bias-pill {
      background: #ecfeff;
      border: 1px solid #99f6e4;
      border-radius: 999px;
      color: #0f766e;
      font-size: 13px;
      font-weight: 800;
      padding: 8px 12px;
      white-space: nowrap;
    }

    .chart-wrap {
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      height: 380px;
      overflow: hidden;
    }

    .chart-wrap svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .grid-lines line {
      stroke: #e2e8f0;
      stroke-width: 1;
    }

    .axis-labels text {
      fill: #64748b;
      font-size: 12px;
      font-weight: 700;
    }

    .range-band {
      fill: rgba(20, 184, 166, 0.16);
      stroke: none;
    }

    .target-line {
      fill: none;
      stroke: #0f766e;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 4;
    }

    .reference-line {
      stroke: #f97316;
      stroke-dasharray: 8 8;
      stroke-width: 2;
    }

    .reference-label {
      fill: #c2410c;
      font-size: 13px;
      font-weight: 800;
    }

    .point {
      fill: #0f766e;
      stroke: #ffffff;
      stroke-width: 3;
    }

    .analysis-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
      gap: 24px;
    }

    .decision-strip {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 20px;
    }

    .decision-strip div {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
    }

    .decision-strip span {
      color: #64748b;
      display: block;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .decision-strip strong {
      color: #111827;
      font-size: 15px;
    }

    .scenario-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 104px;
      gap: 14px;
      padding: 16px 0;
      border-top: 1px solid #e5e7eb;
    }

    .scenario-row:first-of-type {
      border-top: 0;
      padding-top: 4px;
    }

    .scenario-row strong,
    .scenario-row span,
    .scenario-meta b,
    .scenario-meta small {
      display: block;
    }

    .scenario-row strong {
      color: #111827;
      font-size: 15px;
      margin-bottom: 4px;
    }

    .scenario-row span,
    .scenario-meta small {
      color: #64748b;
      font-size: 13px;
    }

    .scenario-meta {
      text-align: right;
    }

    .scenario-meta b {
      color: #0f766e;
      font-size: 20px;
    }

    .notes-card {
      margin-top: 24px;
    }

    .source-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;
    }

    .source-links a {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 999px;
      color: #1d4ed8;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 12px;
      text-decoration: none;
    }

    @media (max-width: 900px) {
      .forecast-hero,
      .analysis-grid,
      .metric-grid {
        grid-template-columns: 1fr;
      }

      .prediction-panel {
        min-height: auto;
      }

      .page-title {
        font-size: 34px;
      }

      .chart-header,
      .navbar-content,
      .decision-strip {
        align-items: stretch;
        flex-direction: column;
        grid-template-columns: 1fr;
      }

      .chart-wrap {
        height: 320px;
      }
    }
  `]
})
export class TeslaForecastComponent {
  readonly generatedAt = 'June 5, 2026 8:43 AM ET';
  readonly currentPrice = 421.83;
  readonly bidPrice = 421.6;
  readonly askPrice = 421.94;
  readonly previousClose = 418.45;
  readonly previousCloseDate = 'June 4, 2026';
  readonly expectedMove = 12.85;
  readonly expectedMovePercent = 3.07;
  readonly maxPain = 420;
  readonly modelTarget = 422.5;
  readonly dayLow = 409;
  readonly dayHigh = 434;
  readonly bullishTrigger = 425;
  readonly bearishTrigger = 415;
  readonly yTicks = [405, 410, 415, 420, 425, 430, 435];
  readonly yMin = 404;
  readonly yMax = 436;
  readonly chartLeft = 64;
  readonly chartRight = 884;
  readonly chartTop = 28;
  readonly chartBottom = 328;

  readonly forecastPoints: ForecastPoint[] = [
    { time: '8:43', price: 421.8, lower: 409.0, upper: 434.7 },
    { time: '9:30', price: 423.1, lower: 411.2, upper: 433.0 },
    { time: '10:30', price: 424.6, lower: 413.5, upper: 432.7 },
    { time: '12:00', price: 423.2, lower: 414.0, upper: 431.4 },
    { time: '2:00', price: 421.7, lower: 412.4, upper: 429.9 },
    { time: '4:00', price: 422.5, lower: 410.7, upper: 431.3 }
  ];

  readonly scenarios: Scenario[] = [
    {
      label: 'Base case',
      probability: '45%',
      range: '$420-$424',
      summary: 'Price holds near the 420 strike as options positioning offsets the positive catalyst.'
    },
    {
      label: 'Upside break',
      probability: '35%',
      range: '$428-$432',
      summary: 'A hold above 425 can force short-dated call hedging and momentum follow-through.'
    },
    {
      label: 'Downside flush',
      probability: '20%',
      range: '$406-$415',
      summary: 'A break below 415 turns the setup defensive and raises 0DTE downside risk.'
    }
  ];

  constructor(private router: Router) {}

  formatCurrency(value: number): string {
    return `$${value.toFixed(value % 1 === 0 ? 0 : 2)}`;
  }

  x(index: number): number {
    const span = this.chartRight - this.chartLeft;
    const step = span / (this.forecastPoints.length - 1);
    return this.chartLeft + index * step;
  }

  y(price: number): number {
    const ratio = (this.yMax - price) / (this.yMax - this.yMin);
    return this.chartTop + ratio * (this.chartBottom - this.chartTop);
  }

  linePath(key: 'price' | 'upper' | 'lower'): string {
    return this.forecastPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${this.x(index).toFixed(1)} ${this.y(point[key]).toFixed(1)}`)
      .join(' ');
  }

  bandPath(): string {
    const upperPath = this.forecastPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${this.x(index).toFixed(1)} ${this.y(point.upper).toFixed(1)}`)
      .join(' ');
    const lowerPath = [...this.forecastPoints]
      .reverse()
      .map((point, index) => `L ${this.x(this.forecastPoints.length - 1 - index).toFixed(1)} ${this.y(point.lower).toFixed(1)}`)
      .join(' ');
    return `${upperPath} ${lowerPath} Z`;
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
