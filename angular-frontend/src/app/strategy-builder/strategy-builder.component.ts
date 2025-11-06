import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { MarketDataService, OptionData, StockPrice } from '../services/market-data.service';
import { OptionsCalculatorService, OptionLeg, PayoffPoint } from '../services/options-calculator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-strategy-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="strategy-builder">
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
              <path d="M9 11H15M12 8V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Strategy Builder</h1>
            <p class="page-subtitle">Create and configure your options trading strategy</p>
          </div>
        </div>
        
        <div class="builder-layout">
          <div class="builder-form">
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Strategy Configuration
                </h3>
              </div>
              
              <div *ngIf="message" class="alert" [class.alert-success]="!error" [class.alert-danger]="error">
                <svg class="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path *ngIf="!error" d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71537 9.79619 2.24013C11.8996 1.76488 14.1003 1.98234 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline *ngIf="!error" points="22,4 12,14.01 9,11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle *ngIf="error" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <line *ngIf="error" x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                  <line *ngIf="error" x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ message }}
              </div>
              
              <form (ngSubmit)="onSave()" class="strategy-form">
                <div class="stock-selector">
                  <div class="form-group">
                    <label class="form-label">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Stock Symbol
                    </label>
                    <select class="form-control" [(ngModel)]="strategy.stock" name="stock" (change)="onStockChange()">
                      <option value="AAPL">AAPL</option>
                      <option value="TSLA">TSLA</option>
                      <option value="SPY">SPY</option>
                      <option value="QQQ">QQQ</option>
                      <option value="MSFT">MSFT</option>
                      <option value="GOOGL">GOOGL</option>
                    </select>
                  </div>
                  
                  <div class="stock-price" *ngIf="stockPrice">
                    <div class="price-display">
                      <span class="current-price">\${{ stockPrice.price }}</span>
                      <span class="price-change" [class.positive]="stockPrice.change >= 0" [class.negative]="stockPrice.change < 0">
                        {{ stockPrice.change >= 0 ? '+' : '' }}{{ stockPrice.change }} ({{ stockPrice.changePercent }}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="options-builder" *ngIf="stockPrice">
                  <h4>Add Option Leg</h4>
                  
                  <div class="option-controls">
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Action</label>
                        <select class="form-control" [(ngModel)]="selectedAction" name="action">
                          <option value="BUY">Buy</option>
                          <option value="SELL">Sell</option>
                        </select>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Type</label>
                        <select class="form-control" [(ngModel)]="selectedType" name="type">
                          <option value="CALL">Call</option>
                          <option value="PUT">Put</option>
                        </select>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-control" [(ngModel)]="quantity" name="quantity" min="1" max="100">
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">Expiry</label>
                        <select class="form-control" [(ngModel)]="selectedExpiry" name="expiry">
                          <option *ngFor="let expiry of getAvailableExpiries()" [value]="expiry">{{ expiry }}</option>
                        </select>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Strike</label>
                        <select class="form-control" [(ngModel)]="selectedStrike" name="strike">
                          <option *ngFor="let strike of getAvailableStrikes()" [value]="strike">\${{ strike }}</option>
                        </select>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">Price</label>
                        <div class="price-info">\${{ getSelectedOptionPrice() }}</div>
                      </div>
                    </div>
                    
                    <button type="button" class="btn btn-success" (click)="addOptionLeg()" [disabled]="!selectedStrike">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      Add Leg
                    </button>
                  </div>
                </div>
                
                <div class="option-legs" *ngIf="optionLegs.length > 0">
                  <h4>Strategy Legs</h4>
                  <div class="legs-list">
                    <div *ngFor="let leg of optionLegs" class="leg-item">
                      <div class="leg-info">
                        <span class="leg-action" [class.buy]="leg.action === 'BUY'" [class.sell]="leg.action === 'SELL'">{{ leg.action }}</span>
                        <span class="leg-details">{{ leg.quantity }}x {{ leg.type }} \${{ leg.strike }} {{ leg.expiry }}</span>
                        <span class="leg-price">\${{ leg.price }}</span>
                      </div>
                      <button type="button" class="btn-remove" (click)="removeOptionLeg(leg.id)">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                
                <div class="form-group">
                  <label class="form-label">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Strategy Notes
                  </label>
                  <textarea class="form-control" [(ngModel)]="strategy.notes" name="notes" rows="4" placeholder="Describe your strategy, market outlook, and key considerations..."></textarea>
                </div>
                
                <div class="form-actions">
                  <button type="submit" class="btn btn-success" [disabled]="loading">
                    <svg *ngIf="loading" class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    <svg *ngIf="!loading" class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ loading ? 'Saving Strategy...' : 'Save Strategy' }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="goBack()">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div class="builder-preview">
            <div class="card">
              <div class="card-header">
                <h3>
                  <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.21 15.89C20.5738 17.3945 19.5788 18.7202 18.3119 19.7513C17.0449 20.7824 15.5447 21.4874 13.9424 21.8048C12.3401 22.1221 10.6844 22.0421 9.12012 21.5718C7.55585 21.1014 6.1306 20.2551 4.969 19.1067C3.8074 17.9582 2.94479 16.5428 2.45661 14.984C1.96843 13.4251 1.86954 11.7705 2.16857 10.1646C2.46761 8.55878 3.15547 7.05063 4.17202 5.77203C5.18857 4.49343 6.50286 3.48332 8.0 2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Strategy Preview
                </h3>
              </div>
              
              <div class="preview-content">
                <div class="preview-item">
                  <span class="preview-label">Symbol:</span>
                  <span class="preview-value">{{ strategy.stock }}</span>
                </div>
                <div class="preview-item" *ngIf="stockPrice">
                  <span class="preview-label">Current Price:</span>
                  <span class="preview-value">\${{ stockPrice.price }}</span>
                </div>
                <div class="preview-item">
                  <span class="preview-label">Legs:</span>
                  <span class="preview-value">{{ optionLegs.length }}</span>
                </div>
                <div class="preview-item" *ngIf="strategy.expectedProfit !== null">
                  <span class="preview-label">Max Profit:</span>
                  <span class="preview-value profit">\${{ strategy.expectedProfit }}</span>
                </div>
                <div class="preview-item" *ngIf="strategy.expectedLoss !== null">
                  <span class="preview-label">Max Loss:</span>
                  <span class="preview-value loss">\${{ strategy.expectedLoss }}</span>
                </div>
              </div>
              
              <div class="preview-chart">
                <div *ngIf="payoffData.length === 0" class="chart-placeholder">
                  <svg class="chart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L12 6L16 10L21 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <p>Add option legs to see payoff diagram</p>
                </div>
                
                <div *ngIf="payoffData.length > 0" class="payoff-chart">
                  <h5>Payoff Diagram</h5>
                  <svg class="chart-svg" viewBox="0 0 400 200">
                    <!-- Chart axes -->
                    <line x1="40" y1="160" x2="360" y2="160" stroke="#e2e8f0" stroke-width="1"/>
                    <line x1="200" y1="20" x2="200" y2="180" stroke="#e2e8f0" stroke-width="1"/>
                    
                    <!-- Payoff line -->
                    <polyline 
                      [attr.points]="getPayoffPoints()" 
                      fill="none" 
                      stroke="#667eea" 
                      stroke-width="2"
                    />
                    
                    <!-- Zero line -->
                    <line x1="40" y1="100" x2="360" y2="100" stroke="#cbd5e0" stroke-width="1" stroke-dasharray="5,5"/>
                    
                    <!-- Labels -->
                    <text x="200" y="195" text-anchor="middle" font-size="12" fill="#718096">Stock Price</text>
                    <text x="15" y="105" text-anchor="middle" font-size="12" fill="#718096" transform="rotate(-90 15 105)">P&L</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .strategy-builder {
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
    
    .builder-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 32px;
    }
    
    .card-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    
    .card-header h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .strategy-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .alert {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .alert-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
    }
    
    .preview-content {
      margin-bottom: 24px;
    }
    
    .preview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .preview-label {
      font-weight: 500;
      color: #4a5568;
    }
    
    .preview-value {
      font-weight: 600;
    }
    
    .preview-value.profit {
      color: #28a745;
    }
    
    .preview-value.loss {
      color: #dc3545;
    }
    
    .preview-chart {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding-top: 24px;
    }
    
    .chart-placeholder {
      text-align: center;
      padding: 40px 20px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 8px;
      border: 2px dashed rgba(102, 126, 234, 0.2);
    }
    
    .chart-icon {
      width: 48px;
      height: 48px;
      color: #667eea;
      margin-bottom: 12px;
    }
    
    .chart-placeholder p {
      color: #718096;
      margin: 0;
      font-size: 14px;
    }
    
    .stock-selector {
      display: flex;
      align-items: flex-end;
      gap: 20px;
      margin-bottom: 32px;
      padding: 20px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(102, 126, 234, 0.1);
    }
    
    .stock-price {
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
    
    .options-builder {
      margin-bottom: 32px;
    }
    
    .options-builder h4 {
      margin-bottom: 20px;
      color: #4a5568;
    }
    
    .option-controls {
      background: rgba(255, 255, 255, 0.5);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .price-info {
      padding: 12px 16px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 8px;
      font-weight: 600;
      color: #667eea;
    }
    
    .option-legs h4 {
      margin-bottom: 16px;
      color: #4a5568;
    }
    
    .legs-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .leg-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .leg-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .leg-action {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .leg-action.buy {
      background: #d4edda;
      color: #155724;
    }
    
    .leg-action.sell {
      background: #f8d7da;
      color: #721c24;
    }
    
    .leg-details {
      font-weight: 500;
    }
    
    .leg-price {
      font-weight: 600;
      color: #667eea;
    }
    
    .btn-remove {
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-remove:hover {
      background: #c82333;
    }
    
    .btn-remove .icon {
      width: 16px;
      height: 16px;
    }
    
    .payoff-chart {
      text-align: center;
    }
    
    .payoff-chart h5 {
      margin-bottom: 16px;
      color: #4a5568;
    }
    
    .chart-svg {
      width: 100%;
      height: 200px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
    }
    
    @media (max-width: 1024px) {
      .builder-layout {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .stock-selector {
        flex-direction: column;
        align-items: stretch;
      }
      
      .price-display {
        align-items: flex-start;
      }
    }
  `]
})
export class StrategyBuilderComponent implements OnInit, OnDestroy {
  strategy = {
    stock: 'AAPL',
    type: '',
    expectedProfit: null as number | null,
    expectedLoss: null as number | null,
    notes: ''
  };
  loading = false;
  message = '';
  error = false;
  
  // Options data
  stockPrice: StockPrice | null = null;
  optionsChain: OptionData[] = [];
  optionLegs: OptionLeg[] = [];
  payoffData: PayoffPoint[] = [];
  
  // UI state
  selectedExpiry = '2024-01-19';
  selectedStrike = 0;
  selectedType: 'CALL' | 'PUT' = 'CALL';
  selectedAction: 'BUY' | 'SELL' = 'BUY';
  quantity = 1;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private marketData: MarketDataService,
    private calculator: OptionsCalculatorService
  ) {}
  
  ngOnInit() {
    this.loadMarketData();
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMarketData() {
    if (this.strategy.stock) {
      const priceSub = this.marketData.getStockPrice(this.strategy.stock).subscribe(price => {
        this.stockPrice = price || null;
        if (price && this.selectedStrike === 0) {
          this.selectedStrike = Math.round(price.price / 5) * 5;
        }
      });
      
      const optionsSub = this.marketData.getOptionsChain(this.strategy.stock).subscribe(options => {
        this.optionsChain = options;
      });
      
      this.subscriptions.push(priceSub, optionsSub);
    }
  }
  
  onStockChange() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.optionLegs = [];
    this.payoffData = [];
    this.loadMarketData();
  }
  
  addOptionLeg() {
    const selectedOption = this.optionsChain.find(opt => 
      opt.strike === this.selectedStrike && 
      opt.expiry === this.selectedExpiry && 
      opt.type === this.selectedType
    );
    
    if (selectedOption) {
      const leg: OptionLeg = {
        id: Date.now().toString(),
        action: this.selectedAction,
        type: this.selectedType,
        strike: this.selectedStrike,
        expiry: this.selectedExpiry,
        quantity: this.quantity,
        price: selectedOption.price
      };
      
      this.optionLegs.push(leg);
      this.updatePayoffChart();
      this.updateStrategyMetrics();
    }
  }
  
  removeOptionLeg(id: string) {
    this.optionLegs = this.optionLegs.filter(leg => leg.id !== id);
    this.updatePayoffChart();
    this.updateStrategyMetrics();
  }
  
  updatePayoffChart() {
    if (this.optionLegs.length > 0) {
      const priceRange = this.generatePriceRange();
      this.payoffData = this.calculator.calculatePayoff(this.optionLegs, priceRange);
    } else {
      this.payoffData = [];
    }
  }
  
  updateStrategyMetrics() {
    if (this.optionLegs.length > 0) {
      this.strategy.expectedProfit = this.calculator.calculateMaxProfit(this.optionLegs);
      this.strategy.expectedLoss = this.calculator.calculateMaxLoss(this.optionLegs);
    }
  }
  
  generatePriceRange(): number[] {
    if (!this.stockPrice) return [];
    
    const currentPrice = this.stockPrice.price;
    const range = currentPrice * 0.5;
    const start = Math.max(0, currentPrice - range);
    const end = currentPrice + range;
    
    const prices = [];
    for (let price = start; price <= end; price += 2) {
      prices.push(price);
    }
    return prices;
  }
  
  getAvailableStrikes(): number[] {
    return [...new Set(this.optionsChain
      .filter(opt => opt.expiry === this.selectedExpiry)
      .map(opt => opt.strike))]
      .sort((a, b) => a - b);
  }
  
  getAvailableExpiries(): string[] {
    return [...new Set(this.optionsChain.map(opt => opt.expiry))].sort();
  }
  
  getSelectedOptionPrice(): number {
    const option = this.optionsChain.find(opt => 
      opt.strike === this.selectedStrike && 
      opt.expiry === this.selectedExpiry && 
      opt.type === this.selectedType
    );
    return option?.price || 0;
  }
  
  onSave() {
    this.loading = true;
    this.message = '';
    
    const strategyData = {
      expected_profit: this.strategy.expectedProfit,
      expected_loss: this.strategy.expectedLoss,
      notes: this.strategy.notes + `\n\nLegs: ${JSON.stringify(this.optionLegs)}`
    };
    
    this.apiService.createStrategy(strategyData).subscribe({
      next: (response) => {
        this.message = 'Strategy saved successfully!';
        this.error = false;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (error) => {
        this.message = 'Failed to save strategy';
        this.error = true;
        this.loading = false;
      }
    });
  }

  getPayoffPoints(): string {
    if (this.payoffData.length === 0) return '';
    
    const minPrice = Math.min(...this.payoffData.map(p => p.stockPrice));
    const maxPrice = Math.max(...this.payoffData.map(p => p.stockPrice));
    const minPayoff = Math.min(...this.payoffData.map(p => p.payoff));
    const maxPayoff = Math.max(...this.payoffData.map(p => p.payoff));
    
    return this.payoffData.map(point => {
      const x = 40 + ((point.stockPrice - minPrice) / (maxPrice - minPrice)) * 320;
      const y = 160 - ((point.payoff - minPayoff) / (maxPayoff - minPayoff)) * 140;
      return `${x},${y}`;
    }).join(' ');
  }
  
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}