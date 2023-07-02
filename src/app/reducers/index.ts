import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import * as fromAdmin from '../admin/reducers';
import * as fromMama from '../mama/reducers';

export interface State {
  admin: fromAdmin.AdminState,
  mama: fromMama.MamaState
}

export const reducers: ActionReducerMap<State> = {
  admin: fromAdmin.reducers,
  mama: fromMama.reducers
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
