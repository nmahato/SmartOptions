import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MarketDataService, OptionData, StockPrice } from '../services/market-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-options-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="options-table">
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Live Options Table</h1>
            <p class="page-subtitle">Real-time options pricing and Greeks</p>
          </div>
        </div>
        
        <div class="controls">
          <div class="stock-selector">
            <label class="form-label">Stock Symbol</label>
            <select class="form-control" [(ngModel)]="selectedStock" (change)="onStockChange()">
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
        </div>
        
        <div class="table-container">
          <div class="table-header">
            <h3>Options Chain</h3>
            <div class="live-indicator">
              <div class="pulse"></div>
              Live Data
            </div>
          </div>
          
          <div class="options-grid">
            <div class="calls-section">
              <h4>Calls</h4>
              <div class="options-table-wrapper">
                <table class="options-data-table">
                  <thead>
                    <tr>
                      <th>Strike</th>
                      <th>Price</th>
                      <th>Delta</th>
                      <th>Gamma</th>
                      <th>Theta</th>
                      <th>Vega</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let option of getCallOptions()" 
                        [class.itm]="option.strike < (stockPrice?.price || 0)"
                        [class.atm]="isATM(option.strike)">
                      <td class="strike">\${{ option.strike }}</td>
                      <td class="price">\${{ option.price }}</td>
                      <td class="greek">{{ option.delta }}</td>
                      <td class="greek">{{ option.gamma }}</td>
                      <td class="greek">{{ option.theta }}</td>
                      <td class="greek">{{ option.vega }}</td>
                      <td class="volume">{{ option.volume }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="puts-section">
              <h4>Puts</h4>
              <div class="options-table-wrapper">
                <table class="options-data-table">
                  <thead>
                    <tr>
                      <th>Strike</th>
                      <th>Price</th>
                      <th>Delta</th>
                      <th>Gamma</th>
                      <th>Theta</th>
                      <th>Vega</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let option of getPutOptions()" 
                        [class.itm]="option.strike > (stockPrice?.price || 0)"
                        [class.atm]="isATM(option.strike)">
                      <td class="strike">\${{ option.strike }}</td>
                      <td class="price">\${{ option.price }}</td>
                      <td class="greek">{{ option.delta }}</td>
                      <td class="greek">{{ option.gamma }}</td>
                      <td class="greek">{{ option.theta }}</td>
                      <td class="greek">{{ option.vega }}</td>
                      <td class="volume">{{ option.volume }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .options-table {
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
    
    .controls {
      display: flex;
      align-items: flex-end;
      gap: 32px;
      margin-bottom: 32px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .stock-selector {
      min-width: 200px;
    }
    
    .stock-info {
      flex: 1;
    }
    
    .price-display {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .current-price {
      font-size: 24px;
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
    
    .table-container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 24px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .table-header h3 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    
    .live-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #28a745;
      font-size: 14px;
      font-weight: 500;
    }
    
    .pulse {
      width: 8px;
      height: 8px;
      background: #28a745;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    
    .calls-section h4,
    .puts-section h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #4a5568;
    }
    
    .options-table-wrapper {
      overflow-x: auto;
    }
    
    .options-data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    
    .options-data-table th {
      background: rgba(102, 126, 234, 0.1);
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      border-bottom: 2px solid rgba(102, 126, 234, 0.2);
    }
    
    .options-data-table td {
      padding: 10px 8px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .options-data-table tr:hover {
      background: rgba(102, 126, 234, 0.05);
    }
    
    .options-data-table tr.itm {
      background: rgba(40, 167, 69, 0.05);
    }
    
    .options-data-table tr.atm {
      background: rgba(255, 193, 7, 0.1);
      font-weight: 600;
    }
    
    .strike {
      font-weight: 600;
      color: #2d3748;
    }
    
    .price {
      font-weight: 600;
      color: #667eea;
    }
    
    .greek {
      color: #718096;
      font-family: monospace;
    }
    
    .volume {
      color: #4a5568;
    }
    
    @media (max-width: 1024px) {
      .options-grid {
        grid-template-columns: 1fr;
      }
      
      .controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .price-display {
        align-items: flex-start;
      }
    }
  `]
})
export class OptionsTableComponent implements OnInit, OnDestroy {
  selectedStock = 'AAPL';
  stockPrice: StockPrice | null = null;
  optionsChain: OptionData[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private marketData: MarketDataService
  ) {}

  ngOnInit() {
    this.loadMarketData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMarketData() {
    const priceSub = this.marketData.getStockPrice(this.selectedStock).subscribe(price => {
      this.stockPrice = price || null;
    });
    
    const optionsSub = this.marketData.getOptionsChain(this.selectedStock).subscribe(options => {
      this.optionsChain = options;
    });
    
    this.subscriptions.push(priceSub, optionsSub);
  }

  onStockChange() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.loadMarketData();
  }

  getCallOptions(): OptionData[] {
    return this.optionsChain
      .filter(option => option.type === 'CALL')
      .sort((a, b) => a.strike - b.strike);
  }

  getPutOptions(): OptionData[] {
    return this.optionsChain
      .filter(option => option.type === 'PUT')
      .sort((a, b) => a.strike - b.strike);
  }

  isATM(strike: number): boolean {
    if (!this.stockPrice) return false;
    return Math.abs(strike - this.stockPrice.price) <= 2.5;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}