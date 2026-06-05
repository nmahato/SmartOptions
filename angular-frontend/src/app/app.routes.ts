import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StrategyBuilderComponent } from './strategy-builder/strategy-builder.component';
import { OptimizerComponent } from './optimizer/optimizer.component';
import { OptionsTableComponent } from './options-table/options-table.component';
import { MarketDataComponent } from './market-data/market-data.component';
import { TeslaForecastComponent } from './tesla-forecast/tesla-forecast.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'strategy-builder', component: StrategyBuilderComponent },
  { path: 'optimizer', component: OptimizerComponent },
  { path: 'options-table', component: OptionsTableComponent },
  { path: 'market-data', component: MarketDataComponent },
  { path: 'tesla-forecast', component: TeslaForecastComponent }
];
