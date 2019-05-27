import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectTableComponent} from "./select-table.component";
import {
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule
} from '@angular/material';
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [SelectTableComponent],
    imports: [
        CommonModule,
        MatTableModule,
        MatCheckboxModule,
        MatSortModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
    ],
    exports: [
        SelectTableComponent
    ]
})
export class SelectTableModule {
}
