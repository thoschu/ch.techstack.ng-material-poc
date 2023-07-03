import { Injectable } from '@angular/core';
import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { noop, Observable, tap } from 'rxjs';

import { mamaActions } from './mama.actions';

@Injectable()
export class MamaEffects {

  private effectName$: Observable<Action> & CreateEffectMetadata;

  constructor(private readonly actions$: Actions) {
    // actions$
    //   .pipe(tap((action: Action): void => {
    //     console.log(action.type);
    //   }))
    //   .subscribe(noop);
    //
    this.actions$
      .pipe(ofType(mamaActions.loadMamasSuccess))
      .pipe(tap((action: Action): void => {
        console.log(action.type);
      }))
      .subscribe(noop);

    // ----------------------------------------------------

    this.effectName$ = createEffect(
      () => this.actions$
        .pipe(ofType(mamaActions.loadMamasDelete))
        .pipe(tap((action: Action): void => {
          console.log(action.type);
        })), { dispatch: false }
    );
  }
}
