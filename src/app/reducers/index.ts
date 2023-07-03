import { isDevMode } from '@angular/core';
import {
  ActionCreator,
  ActionReducer,
  ActionReducerMap, createAction,
  createFeatureSelector, createReducer,
  createSelector,
  MetaReducer, on, props
} from '@ngrx/store';
import * as fromAdmin from '../admin/reducers';
import * as fromMama from '../mama/reducers';
import { appActions } from '../app.actions';

export interface State {
  app: AppState,
  admin: fromAdmin.AdminState,
  mama: fromMama.MamaState
}

export interface AppState {
  app: string;
}

export const initialAppState: AppState = {
  app: 'abc'
};

export const reducer: ActionReducer<AppState>= createReducer(
  initialAppState,
  on(
    appActions.loadApps,
    (state: AppState, action): AppState => {
      console.log('reducer:loadApps');
      return {
        ...state,
        app: 'app'
      };
    }
  )
);

export const reducers: ActionReducerMap<State> = {
  app: reducer,
  admin: fromAdmin.reducers,
  mama: fromMama.reducers
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
