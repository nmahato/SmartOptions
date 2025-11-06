import { Injectable } from '@angular/core';
import { OptionData } from './market-data.service';
import { OptionLeg } from './options-calculator.service';

export interface OptimizationCriteria {
  outlook: 'bullish' | 'bearish' | 'neutral' | 'volatile';
  riskTolerance: 'low' | 'medium' | 'high';
  maxLoss: number;
  targetProfit: number;
  timeframe: 'short' | 'medium' | 'long';
  capitalAvailable: number;
}

export interface StrategyTemplate {
  name: string;
  description: string;
  legs: OptionLeg[];
  maxProfit: number;
  maxLoss: number;
  breakevens: number[];
  winRate: number;
  riskReward: number;
  capitalRequired: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

@Injectable({
  providedIn: 'root'
})
export class StrategyOptimizerService {

  optimizeStrategy(
    criteria: OptimizationCriteria,
    stockPrice: number,
    optionsChain: OptionData[]
  ): StrategyTemplate[] {
    const strategies: StrategyTemplate[] = [];
    
    // Generate strategies based on outlook
    switch (criteria.outlook) {
      case 'bullish':
        strategies.push(...this.generateBullishStrategies(stockPrice, optionsChain, criteria));
        break;
      case 'bearish':
        strategies.push(...this.generateBearishStrategies(stockPrice, optionsChain, criteria));
        break;
      case 'neutral':
        strategies.push(...this.generateNeutralStrategies(stockPrice, optionsChain, criteria));
        break;
      case 'volatile':
        strategies.push(...this.generateVolatileStrategies(stockPrice, optionsChain, criteria));
        break;
    }
    
    // Filter and rank strategies
    return this.rankStrategies(strategies, criteria);
  }

  private generateBullishStrategies(stockPrice: number, options: OptionData[], criteria: OptimizationCriteria): StrategyTemplate[] {
    const strategies: StrategyTemplate[] = [];
    const nearExpiry = this.getNearestExpiry(options);
    
    // Long Call
    const atmCall = this.findOption(options, 'CALL', stockPrice, nearExpiry);
    if (atmCall) {
      strategies.push({
        name: 'Long Call',
        description: 'Simple bullish strategy with unlimited upside potential',
        legs: [{
          id: '1',
          action: 'BUY',
          type: 'CALL',
          strike: atmCall.strike,
          expiry: atmCall.expiry,
          quantity: 1,
          price: atmCall.price
        }],
        maxProfit: Infinity,
        maxLoss: -atmCall.price,
        breakevens: [atmCall.strike + atmCall.price],
        winRate: 0.45,
        riskReward: 3.0,
        capitalRequired: atmCall.price * 100,
        complexity: 'beginner'
      });
    }
    
    // Bull Call Spread
    const otmCall = this.findOption(options, 'CALL', stockPrice + 10, nearExpiry);
    if (atmCall && otmCall) {
      const netDebit = atmCall.price - otmCall.price;
      const maxProfitSpread = (otmCall.strike - atmCall.strike) - netDebit;
      
      strategies.push({
        name: 'Bull Call Spread',
        description: 'Limited risk bullish strategy with defined profit target',
        legs: [
          {
            id: '1',
            action: 'BUY',
            type: 'CALL',
            strike: atmCall.strike,
            expiry: atmCall.expiry,
            quantity: 1,
            price: atmCall.price
          },
          {
            id: '2',
            action: 'SELL',
            type: 'CALL',
            strike: otmCall.strike,
            expiry: otmCall.expiry,
            quantity: 1,
            price: otmCall.price
          }
        ],
        maxProfit: maxProfitSpread,
        maxLoss: -netDebit,
        breakevens: [atmCall.strike + netDebit],
        winRate: 0.55,
        riskReward: maxProfitSpread / netDebit,
        capitalRequired: netDebit * 100,
        complexity: 'intermediate'
      });
    }
    
    return strategies;
  }

  private generateBearishStrategies(stockPrice: number, options: OptionData[], criteria: OptimizationCriteria): StrategyTemplate[] {
    const strategies: StrategyTemplate[] = [];
    const nearExpiry = this.getNearestExpiry(options);
    
    // Long Put
    const atmPut = this.findOption(options, 'PUT', stockPrice, nearExpiry);
    if (atmPut) {
      strategies.push({
        name: 'Long Put',
        description: 'Simple bearish strategy with high profit potential',
        legs: [{
          id: '1',
          action: 'BUY',
          type: 'PUT',
          strike: atmPut.strike,
          expiry: atmPut.expiry,
          quantity: 1,
          price: atmPut.price
        }],
        maxProfit: atmPut.strike - atmPut.price,
        maxLoss: -atmPut.price,
        breakevens: [atmPut.strike - atmPut.price],
        winRate: 0.45,
        riskReward: 2.5,
        capitalRequired: atmPut.price * 100,
        complexity: 'beginner'
      });
    }
    
    // Bear Put Spread
    const otmPut = this.findOption(options, 'PUT', stockPrice - 10, nearExpiry);
    if (atmPut && otmPut) {
      const netDebit = atmPut.price - otmPut.price;
      const maxProfitSpread = (atmPut.strike - otmPut.strike) - netDebit;
      
      strategies.push({
        name: 'Bear Put Spread',
        description: 'Limited risk bearish strategy with defined profit target',
        legs: [
          {
            id: '1',
            action: 'BUY',
            type: 'PUT',
            strike: atmPut.strike,
            expiry: atmPut.expiry,
            quantity: 1,
            price: atmPut.price
          },
          {
            id: '2',
            action: 'SELL',
            type: 'PUT',
            strike: otmPut.strike,
            expiry: otmPut.expiry,
            quantity: 1,
            price: otmPut.price
          }
        ],
        maxProfit: maxProfitSpread,
        maxLoss: -netDebit,
        breakevens: [atmPut.strike - netDebit],
        winRate: 0.55,
        riskReward: maxProfitSpread / netDebit,
        capitalRequired: netDebit * 100,
        complexity: 'intermediate'
      });
    }
    
    return strategies;
  }

  private generateNeutralStrategies(stockPrice: number, options: OptionData[], criteria: OptimizationCriteria): StrategyTemplate[] {
    const strategies: StrategyTemplate[] = [];
    const nearExpiry = this.getNearestExpiry(options);
    
    // Iron Condor
    const otmCall = this.findOption(options, 'CALL', stockPrice + 15, nearExpiry);
    const itmCall = this.findOption(options, 'CALL', stockPrice + 5, nearExpiry);
    const otmPut = this.findOption(options, 'PUT', stockPrice - 15, nearExpiry);
    const itmPut = this.findOption(options, 'PUT', stockPrice - 5, nearExpiry);
    
    if (otmCall && itmCall && otmPut && itmPut) {
      const netCredit = (itmCall.price + itmPut.price) - (otmCall.price + otmPut.price);
      
      strategies.push({
        name: 'Iron Condor',
        description: 'Neutral strategy that profits from low volatility',
        legs: [
          { id: '1', action: 'SELL', type: 'CALL', strike: itmCall.strike, expiry: itmCall.expiry, quantity: 1, price: itmCall.price },
          { id: '2', action: 'BUY', type: 'CALL', strike: otmCall.strike, expiry: otmCall.expiry, quantity: 1, price: otmCall.price },
          { id: '3', action: 'SELL', type: 'PUT', strike: itmPut.strike, expiry: itmPut.expiry, quantity: 1, price: itmPut.price },
          { id: '4', action: 'BUY', type: 'PUT', strike: otmPut.strike, expiry: otmPut.expiry, quantity: 1, price: otmPut.price }
        ],
        maxProfit: netCredit,
        maxLoss: (itmCall.strike - otmCall.strike) - netCredit,
        breakevens: [itmPut.strike - netCredit, itmCall.strike + netCredit],
        winRate: 0.65,
        riskReward: 0.8,
        capitalRequired: ((itmCall.strike - otmCall.strike) - netCredit) * 100,
        complexity: 'advanced'
      });
    }
    
    return strategies;
  }

  private generateVolatileStrategies(stockPrice: number, options: OptionData[], criteria: OptimizationCriteria): StrategyTemplate[] {
    const strategies: StrategyTemplate[] = [];
    const nearExpiry = this.getNearestExpiry(options);
    
    // Long Straddle
    const atmCall = this.findOption(options, 'CALL', stockPrice, nearExpiry);
    const atmPut = this.findOption(options, 'PUT', stockPrice, nearExpiry);
    
    if (atmCall && atmPut) {
      const totalCost = atmCall.price + atmPut.price;
      
      strategies.push({
        name: 'Long Straddle',
        description: 'Profits from large price movements in either direction',
        legs: [
          { id: '1', action: 'BUY', type: 'CALL', strike: atmCall.strike, expiry: atmCall.expiry, quantity: 1, price: atmCall.price },
          { id: '2', action: 'BUY', type: 'PUT', strike: atmPut.strike, expiry: atmPut.expiry, quantity: 1, price: atmPut.price }
        ],
        maxProfit: Infinity,
        maxLoss: -totalCost,
        breakevens: [atmCall.strike + totalCost, atmPut.strike - totalCost],
        winRate: 0.35,
        riskReward: 2.8,
        capitalRequired: totalCost * 100,
        complexity: 'intermediate'
      });
    }
    
    return strategies;
  }

  private findOption(options: OptionData[], type: 'CALL' | 'PUT', targetStrike: number, expiry: string): OptionData | null {
    return options
      .filter(opt => opt.type === type && opt.expiry === expiry)
      .reduce((closest, current) => {
        if (!closest) return current;
        return Math.abs(current.strike - targetStrike) < Math.abs(closest.strike - targetStrike) 
          ? current : closest;
      }, null as OptionData | null);
  }

  private getNearestExpiry(options: OptionData[]): string {
    const expiries = [...new Set(options.map(opt => opt.expiry))].sort();
    return expiries[0] || '';
  }

  private rankStrategies(strategies: StrategyTemplate[], criteria: OptimizationCriteria): StrategyTemplate[] {
    return strategies
      .filter(strategy => {
        return Math.abs(strategy.maxLoss) <= criteria.maxLoss &&
               strategy.capitalRequired <= criteria.capitalAvailable;
      })
      .sort((a, b) => {
        let scoreA = this.calculateScore(a, criteria);
        let scoreB = this.calculateScore(b, criteria);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }

  private calculateScore(strategy: StrategyTemplate, criteria: OptimizationCriteria): number {
    let score = 0;
    
    // Risk-reward ratio
    score += strategy.riskReward * 20;
    
    // Win rate
    score += strategy.winRate * 30;
    
    // Risk tolerance alignment
    const riskScore = criteria.riskTolerance === 'low' ? (1 / Math.abs(strategy.maxLoss)) * 100 :
                     criteria.riskTolerance === 'medium' ? strategy.riskReward * 10 :
                     strategy.riskReward * 15;
    score += riskScore;
    
    // Capital efficiency
    score += (strategy.maxProfit / strategy.capitalRequired) * 25;
    
    return score;
  }
}