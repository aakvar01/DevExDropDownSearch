import { Component,  Inject } from '@angular/core';

import { Http } from '@angular/http';
import  'rxjs/operator/toPromise';

import {
    DxDropDownBoxModule,
    DxDataGridModule
} from 'devextreme-angular';

import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DevExddSearch';

  gridDataSource: any;
  _gridBoxValue: number;
  gridBoxOpened: boolean;
  searchTimer: number;
  _gridSelectedRowKeys: number[] = [3];

  constructor(@Inject(Http) http: Http) {
      this.gridDataSource = new DataSource({
          searchExpr: ["CompanyName", "City", "Phone"],
          store: new CustomStore({
              loadMode: "raw",
              key: "ID",
              load: function() {
                  return http.get('assets/data/customers.json')
                      .toPromise()
                      .then(response => {
                          return response.json();
                      });
              }
          })
      });
  }

  isSearchIncomplete(dropDownBox){
      var displayValue = dropDownBox.option("displayValue"),
          text = dropDownBox.option("text");

      text = text && text.length && text[0];
      displayValue = displayValue && displayValue.length && displayValue[0];

      return text !== displayValue;
  }

  grid_onInput(e){
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(function() {
          var text = e.component.option("text");

          this.gridDataSource.searchValue(text);
          if(this.isSearchIncomplete(e.component)) {
              this.gridBoxOpened = true;
              this.gridDataSource.load();
          }
      }.bind(this), 1000);
  }

  grid_valChange(e){


debugger;

  }
  grid_onClosed(e){
      var value = this._gridBoxValue,
          searchValue = this.gridDataSource.searchValue();

      if (this.isSearchIncomplete(e.component)){
          e.component.reset();
          e.component.option("value", value);
      }

      
      if (searchValue) {
          this.gridDataSource.searchValue(null);
          this.gridDataSource.load();
      }
  }

  get gridBoxValue(value: number)  {
      return this._gridBoxValue;
  }

  set gridBoxValue(value: number) {
      this._gridSelectedRowKeys = value && [value] || [];
      this._gridBoxValue = value;
      this.gridBoxOpened = true;
  }

  get gridSelectedRowKeys(): number[] {
      return this._gridSelectedRowKeys;
  }

  set gridSelectedRowKeys(value: [number]) {
      this._gridBoxValue = value.length && value[0] || null;
      this._gridSelectedRowKeys = value;
  }
}
