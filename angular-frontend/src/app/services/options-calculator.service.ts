import { Injectable } from '@angular/core';

export interface OptionLeg {
  id: string;
  action: 'BUY' | 'SELL';
  type: 'CALL' | 'PUT';
  strike: number;
  expiry: string;
  quantity: number;
  price: number;
}

export interface PayoffPoint {
  stockPrice: number;
  payoff: number;
}

@Injectable({
  providedIn: 'root'
})
export class OptionsCalculatorService {

  calculatePayoff(legs: OptionLeg[], stockPriceRange: number[]): PayoffPoint[] {
    return stockPriceRange.map(stockPrice => ({
      stockPrice,
      payoff: this.calculatePayoffAtPrice(legs, stockPrice)
    }));
  }

  private calculatePayoffAtPrice(legs: OptionLeg[], stockPrice: number): number {
    let totalPayoff = 0;

    legs.forEach(leg => {
      const intrinsicValue = this.calculateIntrinsicValue(leg.type, leg.strike, stockPrice);
      const legPayoff = leg.action === 'BUY' 
        ? (intrinsicValue - leg.price) * leg.quantity
        : (leg.price - intrinsicValue) * leg.quantity;
      
      totalPayoff += legPayoff;
    });

    return Number(totalPayoff.toFixed(2));
  }

  private calculateIntrinsicValue(type: 'CALL' | 'PUT', strike: number, stockPrice: number): number {
    if (type === 'CALL') {
      return Math.max(0, stockPrice - strike);
    } else {
      return Math.max(0, strike - stockPrice);
    }
  }

  calculateBreakevens(legs: OptionLeg[]): number[] {
    const breakevens: number[] = [];
    const minStrike = Math.min(...legs.map(leg => leg.strike));
    const maxStrike = Math.max(...legs.map(leg => leg.strike));
    
    // Search for breakeven points in a reasonable range
    for (let price = minStrike - 50; price <= maxStrike + 50; price += 0.1) {
      const payoff = this.calculatePayoffAtPrice(legs, price);
      if (Math.abs(payoff) < 0.05) {
        breakevens.push(Number(price.toFixed(2)));
      }
    }
    
    return [...new Set(breakevens)].sort((a, b) => a - b);
  }

  calculateMaxProfit(legs: OptionLeg[]): number {
    const payoffPoints = this.calculatePayoff(legs, this.generatePriceRange(legs));
    return Math.max(...payoffPoints.map(p => p.payoff));
  }

  calculateMaxLoss(legs: OptionLeg[]): number {
    const payoffPoints = this.calculatePayoff(legs, this.generatePriceRange(legs));
    return Math.min(...payoffPoints.map(p => p.payoff));
  }

  private generatePriceRange(legs: OptionLeg[]): number[] {
    const minStrike = Math.min(...legs.map(leg => leg.strike));
    const maxStrike = Math.max(...legs.map(leg => leg.strike));
    const range = maxStrike - minStrike;
    const start = Math.max(0, minStrike - range);
    const end = maxStrike + range;
    
    const prices = [];
    for (let price = start; price <= end; price += 1) {
      prices.push(price);
    }
    return prices;
  }
}