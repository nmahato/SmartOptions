import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OptionData {
  strike: number;
  expiry: string;
  type: 'CALL' | 'PUT';
  price: number;
  bid: number;
  ask: number;
  iv: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
}

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  private stockPrices = new BehaviorSubject<Map<string, StockPrice>>(new Map());
  
  constructor(private http: HttpClient) {
    this.startPriceUpdates();
  }

  private startPriceUpdates() {
    interval(2000).subscribe(() => {
      this.updateMockPrices();
    });
  }

  private updateMockPrices() {
    const symbols = ['AAPL', 'TSLA', 'SPY', 'QQQ', 'MSFT', 'GOOGL'];
    const currentPrices = this.stockPrices.value;
    
    symbols.forEach(symbol => {
      const basePrice = this.getBasePrice(symbol);
      const change = (Math.random() - 0.5) * 2;
      const currentPrice = currentPrices.get(symbol)?.price || basePrice;
      const newPrice = Math.max(currentPrice + change, basePrice * 0.8);
      
      currentPrices.set(symbol, {
        symbol,
        price: Number(newPrice.toFixed(2)),
        change: Number((newPrice - basePrice).toFixed(2)),
        changePercent: Number(((newPrice - basePrice) / basePrice * 100).toFixed(2))
      });
    });
    
    this.stockPrices.next(new Map(currentPrices));
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'AAPL': 175.50,
      'TSLA': 242.80,
      'SPY': 445.20,
      'QQQ': 378.90,
      'MSFT': 378.85,
      'GOOGL': 138.45
    };
    return basePrices[symbol] || 100;
  }

  getStockPrice(symbol: string): Observable<StockPrice | undefined> {
    return this.stockPrices.asObservable().pipe(
      map(prices => prices.get(symbol))
    );
  }

  getOptionsChain(symbol: string): Observable<OptionData[]> {
    const stockPrice = this.stockPrices.value.get(symbol)?.price || this.getBasePrice(symbol);
    const options: OptionData[] = [];
    
    const strikes = this.generateStrikes(stockPrice);
    const expiries = ['2024-01-19', '2024-02-16', '2024-03-15'];
    
    strikes.forEach(strike => {
      expiries.forEach(expiry => {
        ['CALL', 'PUT'].forEach(type => {
          const option = this.generateOptionData(symbol, strike, expiry, type as 'CALL' | 'PUT', stockPrice);
          options.push(option);
        });
      });
    });
    
    return new Observable(observer => {
      observer.next(options);
      observer.complete();
    });
  }

  private generateStrikes(stockPrice: number): number[] {
    const strikes = [];
    const baseStrike = Math.round(stockPrice / 5) * 5;
    
    for (let i = -10; i <= 10; i++) {
      strikes.push(baseStrike + (i * 5));
    }
    
    return strikes.filter(strike => strike > 0);
  }

  private generateOptionData(symbol: string, strike: number, expiry: string, type: 'CALL' | 'PUT', stockPrice: number): OptionData {
    const timeToExpiry = this.getTimeToExpiry(expiry);
    const moneyness = type === 'CALL' ? (stockPrice - strike) : (strike - stockPrice);
    
    const intrinsicValue = Math.max(moneyness, 0);
    const timeValue = Math.max(0, Math.sqrt(timeToExpiry) * 10 * Math.random());
    const price = intrinsicValue + timeValue;
    
    const iv = 0.2 + (Math.random() * 0.3);
    const delta = type === 'CALL' ? 
      Math.max(0, Math.min(1, 0.5 + moneyness / (stockPrice * 0.2))) :
      Math.max(-1, Math.min(0, -0.5 + moneyness / (stockPrice * 0.2)));
    
    return {
      strike,
      expiry,
      type,
      price: Number(price.toFixed(2)),
      bid: Number((price - 0.05).toFixed(2)),
      ask: Number((price + 0.05).toFixed(2)),
      iv: Number(iv.toFixed(3)),
      delta: Number(delta.toFixed(3)),
      gamma: Number((0.01 + Math.random() * 0.02).toFixed(3)),
      theta: Number((-0.05 - Math.random() * 0.1).toFixed(3)),
      vega: Number((0.1 + Math.random() * 0.2).toFixed(3)),
      volume: Math.floor(Math.random() * 1000)
    };
  }

  private getTimeToExpiry(expiry: string): number {
    const expiryDate = new Date(expiry);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.max(0, diffTime / (1000 * 60 * 60 * 24 * 365));
  }
}