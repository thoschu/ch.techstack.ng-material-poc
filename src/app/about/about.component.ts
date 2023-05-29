import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

export interface PeriodicElement {
  name: string;
  id: number;
  weight: number;
  symbol: string;
  clicked: boolean;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  protected readonly dataSource: PeriodicElement[] = [
    {id: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', clicked: false},
    {id: 2, name: 'Helium', weight: 4.0026, symbol: 'He', clicked: false},
    {id: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', clicked: false},
    {id: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', clicked: false},
    {id: 5, name: 'Boron', weight: 10.811, symbol: 'B', clicked: false},
    {id: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', clicked: false},
    {id: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', clicked: false},
    {id: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', clicked: false},
    {id: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', clicked: false},
    {id: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', clicked: false},
  ];
  protected readonly displayedColumns: string[] = ['id', 'name', 'weight', 'symbol', 'clicked'];
  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const { snapshot }: { snapshot: ActivatedRouteSnapshot } = this.route;
    console.log(snapshot);
  }

  protected clicked(rowData: PeriodicElement): void {
    rowData.clicked = !rowData.clicked;
  }
}
