import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { clone } from 'ramda';
import { finalize, noop, Observable, tap, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

import { AboutService } from './about.service';

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
  protected readonly displayedColumns: string[] = ['id', 'name', 'weight', 'symbol', 'clicked'];
  protected dataSource: PeriodicElement[] = [];
  protected loading: boolean = true;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly aboutService: AboutService
  ) {
    const periodicElements$: Observable<PeriodicElement[]> = aboutService.periodicElements$;

    periodicElements$
      .pipe(delay(2000))
      .pipe(
        tap((elements: PeriodicElement[]): void => {
          this.dataSource = clone<PeriodicElement[]>(elements);
        }),
        catchError((error: Error) => {
          console.error(error); // https://rollbar.com/thoschu
          return throwError((): Error => error);
        }),
        finalize((): boolean => this.loading = false),
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
    const { snapshot }: { snapshot: ActivatedRouteSnapshot } = this.route;
    console.log(snapshot);
  }

  protected clicked(rowData: PeriodicElement): void {
    rowData.clicked = !rowData.clicked;
  }
}
