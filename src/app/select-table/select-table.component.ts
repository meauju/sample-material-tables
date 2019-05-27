import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSlideToggleChange, MatSort, MatTableDataSource} from '@angular/material';
import {filter, orderBy, startsWith} from "lodash-es";
import {BehaviorSubject, combineLatest, interval, Observable, zip} from "rxjs";
import {map, shareReplay, startWith, take} from "rxjs/operators";
import {Set} from 'immutable';


export interface PeriodicElement {
    name: string;
    position: string;
    weight: number;
    symbol: string;
    selectable: boolean;        // Warning 'selectable' must be set for all rows if it is a sortable element (For the sort process : false !== undefined)
}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: '1', name: 'Hydrogen', weight: 1.0079, symbol: 'H', selectable: false},
    {position: '2', name: 'Helium', weight: 4.0026, symbol: 'He', selectable: true},
    {position: '3', name: 'Lithium', weight: 6.941, symbol: 'Li', selectable: true},
    {position: '4', name: 'Beryllium', weight: 9.0122, symbol: 'Be', selectable: true},
    {position: '5', name: 'Boron', weight: 10.811, symbol: 'B', selectable: true},
    {position: '6', name: 'Carbon', weight: 12.0107, symbol: 'C', selectable: true},
    {position: '7', name: 'Nitrogen', weight: 14.0067, symbol: 'N', selectable: true},
    {position: '8', name: 'Oxygen', weight: 15.9994, symbol: 'O', selectable: true},
    {position: '9', name: 'Fluorine', weight: 18.9984, symbol: 'F', selectable: true},
    {position: '10', name: 'Neon', weight: 20.1797, symbol: 'Ne', selectable: true},
];

const allowMultiSelect = true;

@Component({
    selector: 'app-select-table',
    templateUrl: './select-table.component.html',
    styleUrls: ['./select-table.component.scss']
})
export class SelectTableComponent {

    test$: Observable<number>;
    datatableObs$: Observable<PeriodicElement[]|null>;

    isMultiSelect = allowMultiSelect;
    displayedColumns: string[] = ['select', 'selectable', 'position', 'name', 'weight', 'symbol'];
    public loading$: Observable<boolean>;

    public sort$ = new BehaviorSubject('name');
    public direction$ = new BehaviorSubject<''|'asc'|'desc'>('desc');
    public selection$ = new BehaviorSubject<Set<string>>(Set());
    public data$: Observable<PeriodicElement[]>;
    public isAllElementSelected$: Observable<boolean>;
    public hasAtLeastOneSelectedElement$: Observable<boolean>;

    constructor() {
        this.test$ = new Observable((observer) => {
            setTimeout(() => observer.next(), 5000);
        });

        this.datatableObs$ = this.test$.pipe(
            map(() => ELEMENT_DATA),
            startWith(null),
            shareReplay(1),
        );

        this.isAllElementSelected$ = combineLatest(
            this.selection$,
            this.datatableObs$,
        ).pipe(
            map(([selection, data]) => {
                const nbSelectableRows =  filter(data, (row?: PeriodicElement)=>{
                    return this.isSelectable(row);
                });
                const numRows = nbSelectableRows.length;
                return selection.size === numRows;
            }),
        );

        this.hasAtLeastOneSelectedElement$ = combineLatest(
            this.selection$,
            this.isAllElementSelected$,
        ).pipe(
            map(([selection, isAllSelectecElement]) => {
                return !isAllSelectecElement && selection.size > 0;
            }),
        );

        this.data$ = combineLatest(
            this.datatableObs$,
            this.sort$,
            this.direction$,
        ).pipe(
            map(([data, sort, direction]) => {
                if(direction === '') {
                    return data || [];
                }

                return orderBy(data || [], sort, direction);
            })
        );

        this.loading$ = this.datatableObs$.pipe(
            map((val) => val === null),
        );
    }

    sortChange({active, direction}) {
       this.sort$.next(active);
       this.direction$.next(direction);
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    async masterToggle() {
        console.log('masterToggle')
        const data = await this.datatableObs$.pipe(take(1)).toPromise();
        const isAllSelected = await this.isAllElementSelected$.pipe(take(1)).toPromise();
        if (data === null) {
            console.log({data})
            return;
        }
        const els = data.filter((row) => this.isSelectable(row)).map((row) => row.position)
        console.log(els);

        isAllSelected ?
            this.selection$.next(Set()) :
            this.selection$.next(Set(els));
    }

    isSelectable(row?: PeriodicElement): boolean {
        return (row === undefined || row.selectable === undefined) ? true : row.selectable;
    }

    modifySelectionTableBehaviour($event: MatSlideToggleChange) {
        this.isMultiSelect = $event.checked;
        if (!this.isMultiSelect) {
            this.selection$.next(Set());
        }
    }

    async toggleRow(row: any) {
        const selection = await this.selection$.pipe(take(1)).toPromise();
        if(selection.has(row.position)) {
            this.selection$.next(
                selection.delete(row.position),
            );
        } else if (this.isMultiSelect) {
            this.selection$.next(
                selection.add(row.position),
            );
        } else {
            this.selection$.next(Set([row.position]))
        }

    }
}
