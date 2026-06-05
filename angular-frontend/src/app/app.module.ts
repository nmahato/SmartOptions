import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PdfCombinerComponent } from './utilities/pdf-combiner/pdf-combiner.component';
import { PdfToDocxComponent } from './utilities/pdf-to-docx/pdf-to-docx.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PdfCombinerComponent,
    PdfToDocxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
