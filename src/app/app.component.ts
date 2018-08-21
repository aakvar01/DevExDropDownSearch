import { Component,  Inject } from '@angular/core';
import { Http } from '@angular/http';
import  'rxjs/operator/toPromise';
import {
    DxDropDownBoxModule,
    DxDataGridModule
} from 'devextreme-angular';
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DevExddSearch';
  gridDataSource: any;
  _gridBoxValue: number = null;
  gridBoxOpened: boolean = false;
  searchTimer: number;
  _gridSelectedRowKeys: number[]=[1];

  constructor(@Inject(Http) http: Http) {

    this.gridDataSource = this.makeAsyncDataSource(http, "customers.json");

    //   this.gridDataSource = new DataSource({
    //       searchExpr: ["CompanyName", "City", "Phone"],
    //       store: new CustomStore({
    //           loadMode: "raw",
    //           key: "ID",
    //           load: function() {
    //               return http.get('assets/data/customers.json')
    //                   .toPromise()
    //                   .then(response => {
    //                       return response.json();
    //                   });
    //           }
    //       })
    //   });
  }

  makeAsyncDataSource(http, jsonFile) {
    return new DataSource({
      searchExpr: ["CompanyName", "City", "Phone"],
      store: new CustomStore({
        loadMode: "raw",
        key: "ID",
        load: function() {
          return http
            .get(
              "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/data/" +
                jsonFile
            )
            .toPromise() .then(response => {
                                    return response.json();
                            });
        }
      })
    });
  }
  isSearchIncomplete(dropDownBox) {
    let displayValue = dropDownBox.option("displayValue"),
      text = dropDownBox.option("text");
    text = text && text.length && text[0];
    displayValue = displayValue && displayValue.length && displayValue[0];
    return text !== displayValue;
  }
 
  onFocusOut(e) {
    var $target = e.event.relatedTarget;
    if (e.component.content().parentNode === $target) {
      setTimeout(function() {
        e.component.focus();
      });
    }
  }
  grid_onInput(e) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(
      function() {
        const text = e.component.option("text");

        this.gridDataSource.searchValue(text);
        if (this.isSearchIncomplete(e.component)) {
          this.gridBoxOpened = true;
          this.gridDataSource.load();
          
        }
      }.bind(this),
      10
    );
  }

  grid_onClosed(e) {
    const value = this._gridBoxValue,
      searchValue = this.gridDataSource.searchValue();

    if (this.isSearchIncomplete(e.component)) {
      e.component.reset();
      e.component.option("value", value);
    }

    if (searchValue) {
      this.gridDataSource.searchValue(null);
      this.gridDataSource.load();
    }
  }

  get gridBoxValue(): number {
    return this._gridBoxValue;
  }

  set gridBoxValue(value: number) {
    this._gridSelectedRowKeys = (value && [value]) || [];
    this._gridBoxValue = value;

    setTimeout(() => (this.gridBoxOpened = false));
  }

  get gridSelectedRowKeys(): number[] {
    return this._gridSelectedRowKeys;
  }

  set gridSelectedRowKeys(value: number[]) {
    this._gridBoxValue = (value.length && value[0]) || null;
    this._gridSelectedRowKeys = value;
  }
}
