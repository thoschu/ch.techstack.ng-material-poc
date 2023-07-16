import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import {
  Actions,
  createEffect,
  CreateEffectMetadata,
  ofType,
} from '@ngrx/effects';
import { Observable, tap } from 'rxjs';

import { appActions } from './app.actions';
import { Users } from './reducers';

@Injectable()
export class AppEffects {
  private effectName$: Observable<Action> & CreateEffectMetadata;
  constructor(
    private readonly httpClient: HttpClient,
    private readonly actions$: Actions
  ) {
    this.effectName$ = createEffect(
      () =>
        this.actions$.pipe(ofType(appActions.loadResolver)).pipe(
          tap((action: any): void => {
            console.log(action);
            console.log(action.type);

            this.httpClient
              .get('http://localhost:3000/posts')
              .pipe(
                tap((result): void => {
                  console.log(result);

                  // const loadAppsAction: TypedAction<'[App] Load Apps'> = appActions.loadApps();
                })
              )
              .subscribe(console.log);
          })
        ),
      { dispatch: false }
    );
  }
}
