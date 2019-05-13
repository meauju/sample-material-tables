import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort, MatTableDataSource} from '@angular/material';
import {filter} from "lodash-es";


export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
    selectable: boolean;        // Warning 'selectable' must be set for all rows if it is a sortable element (For the sort process : false !== undefined)
}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', selectable: false},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', selectable: true},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', selectable: true},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', selectable: true},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', selectable: true},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', selectable: true},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', selectable: true},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', selectable: true},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', selectable: true},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', selectable: true},
];


@Component({
    selector: 'app-select-table',
    templateUrl: './select-table.component.html',
    styleUrls: ['./select-table.component.scss']
})
export class SelectTableComponent implements OnInit {
    displayedColumns: string[] = ['select', 'selectable', 'position', 'name', 'weight', 'symbol'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    @ViewChild(MatSort) sort: MatSort;

    constructor() {
    }

    ngOnInit() {
        this.dataSource.sort = this.sort;
    }


    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const nbSelectableRows =  filter(this.dataSource.data, (row?: PeriodicElement)=>{
            return this.isSelectable(row);
        });
        const numRows = nbSelectableRows.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        console.log(this.isAllSelected());
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => (this.isSelectable(row)) ? this.selection.select(row): null);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    isSelectable(row?: PeriodicElement): boolean {
        return (row === undefined || row.selectable === undefined) ? true : row.selectable;
    }

}
