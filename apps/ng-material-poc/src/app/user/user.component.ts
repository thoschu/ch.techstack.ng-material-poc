import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable } from 'rxjs';

import { userSelector } from './user.selectors';
import { State } from '../reducers';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  protected user$: Observable<string>;
  constructor(private readonly store: Store<State>) {
    // this.user$ = this.store.pipe(map((state: State): string => state.admin.admin.name));
    // this.user$ = this.store.pipe(map((state: State): string => state.admin.admin.name), distinctUntilChanged());
    // this.user$ = this.store.pipe(select((state: State): string => state.admin.admin.name));

    this.user$ = this.store.pipe(select(userSelector));
  }
}
