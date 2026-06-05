import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PdfCombinerComponent } from './utilities/pdf-combiner/pdf-combiner.component';
import { PdfToDocxComponent } from './utilities/pdf-to-docx/pdf-to-docx.component';

const routes: Routes = [
  // Your existing routes go here
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'utilities/combine-pdf', component: PdfCombinerComponent },
  { path: 'utilities/convert-pdf-to-docx', component: PdfToDocxComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' } // Example default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
