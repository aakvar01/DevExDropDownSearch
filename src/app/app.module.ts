import { NgModule, Component, ViewChild, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Http, HttpModule } from '@angular/http';


import {
    DxDropDownBoxModule,
    DxDataGridModule
} from 'devextreme-angular';

import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxDropDownBoxModule,
    HttpModule,
    DxDataGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);