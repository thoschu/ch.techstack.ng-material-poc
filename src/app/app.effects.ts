import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';

@Injectable()
export class AppEffects {


  constructor(private readonly actions$: Actions) {}
}
