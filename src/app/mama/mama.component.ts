import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { MamaState } from "./reducers";
import { userSelector } from './mama.selectors';
import { State } from '../reducers';
import { mamaActions } from './mama.actions';

@Component({
  selector: 'app-mama',
  templateUrl: './mama.component.html',
  styleUrls: ['./mama.component.scss']
})
export class MamaComponent implements OnInit {
  protected mama!: string;
  constructor(private readonly store: Store<State>) {
    // select: preventing duplicate values from reaching the view
    // userSelector: avoiding unnecessary calculations
    this.store.pipe(select(userSelector))
      .subscribe((mama: string) => {
        this.mama = mama;
    });
  }

  ngOnInit(): void {
    setTimeout((that: MamaComponent): void => {
      const propsMamaState: MamaState = { mama: 'thomas' };

      that.store.dispatch(mamaActions.loadMamasSuccess(propsMamaState));
    }, 5000, this);
  }
}
