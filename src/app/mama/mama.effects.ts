import { Injectable } from '@angular/core';
import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
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
      .pipe(tap((action: {mama: string} & TypedAction<'[Mama] Load Mamas Success'>): void => {
        console.log(action.type);
        console.log(action.mama);

        // strictActionImmutability: true,
        // action.mama = '...nope...';
        // ToDo
      }))
      .subscribe(noop);

    // ----------------------------------------------------

    this.effectName$ = createEffect(
      () => this.actions$
        .pipe(ofType(mamaActions.loadMamasDelete))
        .pipe(tap((action: TypedAction<'[Mama] Load Mamas Delete'>): void => {
          console.log(action);
          console.log(action.type);
          // ToDo
        })), { dispatch: false }
    );
  }
}
