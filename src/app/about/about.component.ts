import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
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
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', clicked: false},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', clicked: false},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', clicked: false},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', clicked: false},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', clicked: false},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', clicked: false},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', clicked: false},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', clicked: false},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', clicked: false},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', clicked: false},
  ];
  protected readonly displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'clicked'];
  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    const { snapshot }: { snapshot: ActivatedRouteSnapshot } = this.route;
    console.log(snapshot);
  }

  protected clicked(rowData: PeriodicElement): void {
    rowData.clicked = !rowData.clicked;
  }
}
