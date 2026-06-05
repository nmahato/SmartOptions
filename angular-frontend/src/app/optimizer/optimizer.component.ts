import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MarketDataService, StockPrice } from '../services/market-data.service';
import { StrategyOptimizerService, OptimizationCriteria, StrategyTemplate } from '../services/strategy-optimizer.service';

@Component({
  selector: 'app-optimizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="optimizer">
      <nav class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="navbar-brand">
              <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
              SmartOptions
            </div>
            <button class="btn btn-secondary" (click)="goBack()">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>
      
      <div class="container">
        <div class="page-header">
          <div class="page-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Strategy Optimizer</h1>
            <p class="page-subtitle">Find optimal options strategies based on your market outlook and risk preferences</p>
          </div>
        </div>
        
        <div class="optimizer-layout">
          <div class="criteria-panel">
            <div class="card">
              <div class="card-header">
                <h3>Optimization Criteria</h3>
              </div>
              
              <form class="criteria-form">
                <div class="form-group">
                  <label class="form-label">Stock Symbol</label>
                  <select class="form-control" [(ngModel)]="selectedStock" name="stock" (change)="onStockChange()">
                    <option value="AAPL">AAPL</option>
                    <option value="TSLA">TSLA</option>
                    <option value="SPY">SPY</option>
                    <option value="QQQ">QQQ</option>
                    <option value="MSFT">MSFT</option>
                    <option value="GOOGL">GOOGL</option>
                  </select>
                </div>
                
                <div class="stock-info" *ngIf="stockPrice">
                  <div class="price-display">
                    <span class="current-price">\${{ stockPrice.price }}</span>
                    <span class="price-change" [class.positive]="stockPrice.change >= 0" [class.negative]="stockPrice.change < 0">
                      {{ stockPrice.change >= 0 ? '+' : '' }}{{ stockPrice.change }} ({{ stockPrice.changePercent }}%)
                    </span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Market Outlook</label>
                  <div class="outlook-buttons">
                    <button type="button" 
                            class="outlook-btn" 
                            [class.active]="criteria.outlook === 'bullish'"
                            (click)="criteria.outlook = 'bullish'; optimizeStrategies()">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke="currentColor" stroke-width="2" fill="none"/>
                        <polyline points="17,6 23,6 23,12" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      Bullish
                    </button>
                    <button type="button" 
                            class="outlook-btn" 
                            [class.active]="criteria.outlook === 'bearish'"
                            (click)="criteria.outlook = 'bearish'; optimizeStrategies()">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" stroke="currentColor" stroke-width="2" fill="none"/>
                        <polyline points="17,18 23,18 23,12" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      Bearish
                    </button>
                    <button type="button" 
                            class="outlook-btn" 
                            [class.active]="criteria.outlook === 'neutral'"
                            (click)="criteria.outlook = 'neutral'; optimizeStrategies()">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
                      </svg>
                      Neutral
                    </button>
                    <button type="button" 
                            class="outlook-btn" 
                            [class.active]="criteria.outlook === 'volatile'"
                            (click)="criteria.outlook = 'volatile'; optimizeStrategies()">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="1,12 5,6 9,18 13,6 17,18 21,12" stroke="currentColor" stroke-width="2" fill="none"/>
                      </svg>
                      Volatile
                    </button>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Risk Tolerance</label>
                    <select class="form-control" [(ngModel)]="criteria.riskTolerance" name="risk" (change)="optimizeStrategies()">
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Time Frame</label>
                    <select class="form-control" [(ngModel)]="criteria.timeframe" name="timeframe" (change)="optimizeStrategies()">
                      <option value="short">Short Term (< 1 month)</option>
                      <option value="medium">Medium Term (1-3 months)</option>
                      <option value="long">Long Term (> 3 months)</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Max Loss (\$)</label>
                    <input type="number" class="form-control" [(ngModel)]="criteria.maxLoss" name="maxLoss" (change)="optimizeStrategies()" min="0" step="100">
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label">Available Capital (\$)</label>
                    <input type="number" class="form-control" [(ngModel)]="criteria.capitalAvailable" name="capital" (change)="optimizeStrategies()" min="0" step="1000">
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div class="results-panel">
            <div class="card">
              <div class="card-header">
                <h3>Optimized Strategies</h3>
                <span class="results-count" *ngIf="optimizedStrategies.length > 0">{{ optimizedStrategies.length }} strategies found</span>
              </div>
              
              <div *ngIf="optimizedStrategies.length === 0 && !loading" class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h4>No strategies found</h4>
                <p>Adjust your criteria to find suitable strategies</p>
              </div>
              
              <div *ngIf="loading" class="loading-state">
                <svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                  </circle>
                </svg>
                <p>Optimizing strategies...</p>
              </div>
              
              <div class="strategies-list" *ngIf="optimizedStrategies.length > 0">
                <div *ngFor="let strategy of optimizedStrategies; let i = index" class="strategy-card" [class.rank-1]="i === 0">
                  <div class="strategy-header">
                    <div class="strategy-rank">#{{ i + 1 }}</div>
                    <div class="strategy-info">
                      <h4>{{ strategy.name }}</h4>
                      <p>{{ strategy.description }}</p>
                    </div>
                    <div class="complexity-badge" [class]="strategy.complexity">{{ strategy.complexity }}</div>
                  </div>
                  
                  <div class="strategy-metrics">
                    <div class="metric">
                      <span class="metric-label">Max Profit</span>
                      <span class="metric-value profit">\${{ isInfinite(strategy.maxProfit) ? '∞' : strategy.maxProfit }}</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Max Loss</span>
                      <span class="metric-value loss">\${{ getAbsoluteValue(strategy.maxLoss) }}</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Win Rate</span>
                      <span class="metric-value">{{ (strategy.winRate * 100).toFixed(0) }}%</span>
                    </div>
                    <div class="metric">
                      <span class="metric-label">Capital Req.</span>
                      <span class="metric-value">\${{ strategy.capitalRequired }}</span>
                    </div>
                  </div>
                  
                  <div class="strategy-legs">
                    <h5>Strategy Legs:</h5>
                    <div class="legs-summary">
                      <span *ngFor="let leg of strategy.legs; let last = last" class="leg-summary">
                        {{ leg.action }} {{ leg.quantity }}x {{ leg.type }} \${{ leg.strike }}{{ !last ? ', ' : '' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="strategy-actions">
                    <button class="btn btn-success" (click)="implementStrategy(strategy)">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Implement Strategy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .optimizer {
      min-height: 100vh;
    }
    
    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .page-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .page-icon svg {
      width: 32px;
      height: 32px;
    }
    
    .page-title {
      font-size: 36px;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 8px 0;
    }
    
    .page-subtitle {
      font-size: 16px;
      color: #718096;
      margin: 0;
    }
    
    .optimizer-layout {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 32px;
    }
    
    .card-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-header h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .results-count {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .criteria-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .stock-info {
      padding: 16px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }
    
    .price-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .current-price {
      font-size: 20px;
      font-weight: 700;
      color: #2d3748;
    }
    
    .price-change {
      font-size: 14px;
      font-weight: 600;
    }
    
    .price-change.positive {
      color: #28a745;
    }
    
    .price-change.negative {
      color: #dc3545;
    }
    
    .outlook-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .outlook-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 12px;
      font-weight: 600;
    }
    
    .outlook-btn:hover {
      border-color: #667eea;
    }
    
    .outlook-btn.active {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }
    
    .outlook-btn .icon {
      width: 20px;
      height: 20px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .empty-state, .loading-state {
      text-align: center;
      padding: 60px 20px;
    }
    
    .empty-icon, .spinner {
      width: 64px;
      height: 64px;
      color: #cbd5e0;
      margin-bottom: 20px;
    }
    
    .empty-state h4 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #4a5568;
    }
    
    .empty-state p, .loading-state p {
      color: #718096;
      margin: 0;
    }
    
    .strategies-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .strategy-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .strategy-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    .strategy-card.rank-1 {
      border: 2px solid #667eea;
      background: rgba(102, 126, 234, 0.05);
    }
    
    .strategy-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .strategy-rank {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }
    
    .strategy-info {
      flex: 1;
    }
    
    .strategy-info h4 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 4px 0;
    }
    
    .strategy-info p {
      color: #718096;
      margin: 0;
      font-size: 14px;
    }
    
    .complexity-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .complexity-badge.beginner {
      background: #d4edda;
      color: #155724;
    }
    
    .complexity-badge.intermediate {
      background: #fff3cd;
      color: #856404;
    }
    
    .complexity-badge.advanced {
      background: #f8d7da;
      color: #721c24;
    }
    
    .strategy-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
    }
    
    .metric {
      text-align: center;
    }
    
    .metric-label {
      display: block;
      font-size: 12px;
      color: #718096;
      margin-bottom: 4px;
    }
    
    .metric-value {
      font-size: 16px;
      font-weight: 600;
    }
    
    .metric-value.profit {
      color: #28a745;
    }
    
    .metric-value.loss {
      color: #dc3545;
    }
    
    .strategy-legs {
      margin-bottom: 20px;
    }
    
    .strategy-legs h5 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #4a5568;
    }
    
    .legs-summary {
      font-size: 14px;
      color: #718096;
    }
    
    .leg-summary {
      font-weight: 500;
    }
    
    .strategy-actions {
      text-align: center;
    }
    
    @media (max-width: 1024px) {
      .optimizer-layout {
        grid-template-columns: 1fr;
      }
      
      .strategy-metrics {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class OptimizerComponent implements OnInit, OnDestroy {
  selectedStock = 'AAPL';
  stockPrice: StockPrice | null = null;
  optimizedStrategies: StrategyTemplate[] = [];
  loading = false;
  private optimizationTimeout: any;
  
  criteria: OptimizationCriteria = {
    outlook: 'bullish',
    riskTolerance: 'medium',
    maxLoss: 1000,
    targetProfit: 500,
    timeframe: 'medium',
    capitalAvailable: 5000
  };
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private marketData: MarketDataService,
    private optimizer: StrategyOptimizerService
  ) {}

  ngOnInit() {
    this.loadMarketData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.optimizationTimeout) {
      clearTimeout(this.optimizationTimeout);
    }
  }

  loadMarketData() {
    const priceSub = this.marketData.getStockPrice(this.selectedStock).subscribe(price => {
      this.stockPrice = price || null;
      if (price && this.optimizedStrategies.length === 0) {
        this.optimizeStrategies();
      }
    });
    
    this.subscriptions.push(priceSub);
  }

  onStockChange() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.optimizedStrategies = [];
    this.loadMarketData();
  }

  optimizeStrategies() {
    if (!this.stockPrice) return;
    
    // Clear existing timeout to debounce rapid calls
    if (this.optimizationTimeout) {
      clearTimeout(this.optimizationTimeout);
    }
    
    this.loading = true;
    
    this.optimizationTimeout = setTimeout(() => {
      this.marketData.getOptionsChain(this.selectedStock).subscribe({
        next: (options) => {
          this.optimizedStrategies = this.optimizer.optimizeStrategy(
            this.criteria,
            this.stockPrice!.price,
            options
          );
          this.loading = false;
        },
        error: (error) => {
          console.error('Error optimizing strategies:', error);
          this.loading = false;
        }
      });
    }, 500);
  }

  implementStrategy(strategy: StrategyTemplate) {
    // Navigate to strategy builder with pre-filled strategy
    this.router.navigate(['/strategy-builder'], { 
      state: { 
        prefilledStrategy: strategy,
        stock: this.selectedStock 
      } 
    });
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
  
  isInfinite(value: number): boolean {
    return value === Infinity;
  }
  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}