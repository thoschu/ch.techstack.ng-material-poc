import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { select, Store} from '@ngrx/store';
import { map, Observable } from 'rxjs';

import { State } from '../reducers';
import { userSelector } from '../mama/mama.selectors';

export const userGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const store: Store<State> = inject<Store<State>>(Store);

  return store
    .pipe(
      select(userSelector),
      map((mama: string): boolean => mama === 'thomas:nobody')
    );
};

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private readonly store: Store<State>) {}
  canActivate(route: import('@angular/router').ActivatedRouteSnapshot, state: import('@angular/router').RouterStateSnapshot): Observable<boolean> {
    return this.store
      .pipe(
        select(userSelector),
        map((mama: string): boolean => mama === 'thomas:nobody')
      );
  }
}
