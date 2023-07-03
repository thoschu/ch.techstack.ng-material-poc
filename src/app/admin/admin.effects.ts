import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { prop } from 'ramda';
import { noop, tap } from 'rxjs';

import { adminActions } from './admin.actions';

@Injectable()
export class AdminEffects {
  constructor(
    private readonly actions$: Actions
  ) {
    actions$
      .pipe(tap((action: Action): void => {
        if (action.type === adminActions.setAdminAction.type) {
          // const storageItem: string =  JSON.stringify(action.admin);
          // const storageItem: string =  JSON.stringify(action['admin']);
          const storageItem: string = JSON.stringify(prop<string, 'admin', Action>('admin', action));

          localStorage.setItem('admin', storageItem);
        } else if (action.type == adminActions.deleteAdminAction.type) {
          localStorage.removeItem('admin');
        }
      }))
      .subscribe(noop);
  }
}
