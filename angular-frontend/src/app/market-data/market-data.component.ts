import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-market-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="market-data">
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
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Market Data</h1>
            <p class="page-subtitle">Live stock quotes powered by Finnhub</p>
          </div>
        </div>
        
        <div class="search-section">
          <div class="search-box">
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="searchSymbol" 
              placeholder="Enter stock symbol (e.g., AAPL)"
              (keyup.enter)="searchStock()"
            >
            <button class="btn btn-success" (click)="searchStock()">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
              </svg>
              Search
            </button>
          </div>
        </div>
        
        <div class="results-section" *ngIf="stockData">
          <div class="card">
            <div class="stock-header">
              <div class="stock-info">
                <h2>{{ stockData.symbol }}</h2>
                <p>{{ companyProfile?.name || stockData.symbol }}</p>
              </div>
              <div class="stock-price">
                <span class="current-price">\${{ stockData.current_price }}</span>
                <span class="price-change" [class.positive]="stockData.change >= 0" [class.negative]="stockData.change < 0">
                  {{ stockData.change >= 0 ? '+' : '' }}{{ stockData.change }} ({{ stockData.percent_change }}%)
                </span>
              </div>
            </div>
            
            <div class="stock-details">
              <div class="detail-item">
                <span class="label">Open:</span>
                <span class="value">\${{ stockData.open }}</span>
              </div>
              <div class="detail-item">
                <span class="label">High:</span>
                <span class="value">\${{ stockData.high }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Low:</span>
                <span class="value">\${{ stockData.low }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Previous Close:</span>
                <span class="value">\${{ stockData.previous_close }}</span>
              </div>
            </div>
            
            <div class="company-info" *ngIf="companyProfile">
              <h3>Company Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Exchange:</span>
                  <span class="value">{{ companyProfile.exchange }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Industry:</span>
                  <span class="value">{{ companyProfile.industry }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Country:</span>
                  <span class="value">{{ companyProfile.country }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Market Cap:</span>
                  <span class="value">{{ formatMarketCap(companyProfile.market_cap) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="error-message" *ngIf="errorMessage">
          <div class="alert alert-danger">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .market-data {
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
    
    .search-section {
      margin-bottom: 32px;
    }
    
    .search-box {
      display: flex;
      gap: 12px;
      max-width: 400px;
    }
    
    .search-box input {
      flex: 1;
    }
    
    .stock-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .stock-info h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }
    
    .stock-info p {
      color: #718096;
      margin: 0;
    }
    
    .current-price {
      font-size: 32px;
      font-weight: 700;
      color: #2d3748;
    }
    
    .price-change {
      display: block;
      font-size: 16px;
      font-weight: 600;
      margin-top: 4px;
    }
    
    .price-change.positive {
      color: #28a745;
    }
    
    .price-change.negative {
      color: #dc3545;
    }
    
    .stock-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 8px;
    }
    
    .label {
      font-weight: 500;
      color: #4a5568;
    }
    
    .value {
      font-weight: 600;
      color: #2d3748;
    }
    
    .company-info h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #4a5568;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .error-message {
      margin-top: 20px;
    }
  `]
})
export class MarketDataComponent implements OnInit {
  searchSymbol = '';
  stockData: any = null;
  companyProfile: any = null;
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  searchStock() {
    if (!this.searchSymbol.trim()) return;
    
    this.errorMessage = '';
    const symbol = this.searchSymbol.toUpperCase();
    
    // Get stock quote
    this.http.get(`http://localhost:8000/api/market/quote/${symbol}/`).subscribe({
      next: (data) => {
        this.stockData = data;
        this.getCompanyProfile(symbol);
      },
      error: (error) => {
        this.errorMessage = 'Stock not found or API error';
        this.stockData = null;
        this.companyProfile = null;
      }
    });
  }

  getCompanyProfile(symbol: string) {
    this.http.get(`http://localhost:8000/api/market/profile/${symbol}/`).subscribe({
      next: (data) => {
        this.companyProfile = data;
      },
      error: (error) => {
        console.log('Profile not available');
      }
    });
  }

  formatMarketCap(marketCap: number): string {
    if (!marketCap) return 'N/A';
    
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}T`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}B`;
    } else {
      return `$${marketCap.toFixed(1)}M`;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}