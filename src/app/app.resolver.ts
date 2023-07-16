import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, Observable, tap } from 'rxjs';

import { AppState } from './reducers';
import {appActions} from "./app.actions";

@Injectable()
export class AppResolver implements Resolve<any> {

  constructor(private readonly store: Store<AppState>) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    return this.store
      .pipe(
        tap(() => {
          this.store.dispatch(appActions.loadResolver());
        }),
        first()
      );
  }
}
