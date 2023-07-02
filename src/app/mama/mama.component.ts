import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { userSelector } from './mama.selectors';
import { State } from '../reducers';
import {MamaState} from "./reducers";


@Component({
  selector: 'app-mama',
  templateUrl: './mama.component.html',
  styleUrls: ['./mama.component.scss']
})
export class MamaComponent {
  constructor(private readonly store: Store<State>) {
    console.log('MamaComponent constructor');

    // select: preventing duplicate values from reaching the view
    // userSelector: avoiding unnecessary calculations

    this.store.pipe(select(userSelector))
      .subscribe((mama: string) => {
        console.log(mama);
    });
  }
}
