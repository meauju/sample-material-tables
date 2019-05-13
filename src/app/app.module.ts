import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SelectTableComponent} from './select-table/select-table.component';
import {SelectTableModule} from "./select-table/select-table.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SelectTableModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
