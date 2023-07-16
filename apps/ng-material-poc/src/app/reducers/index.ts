import { isDevMode } from '@angular/core';
import {
  Action,
  ActionCreator,
  ActionReducer,
  ActionReducerMap,
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on,
  props,
} from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { RouterState } from '@ngrx/router-store';
import { TypedAction } from '@ngrx/store/src/models';

import * as Rollbar from 'rollbar';

import * as fromAdmin from '../admin/reducers';
import * as fromMama from '../mama/reducers';
import { appActions } from '../app.actions';

// import { RollbarErrorHandler } from "../app.module";

export interface State {
  app: AppState;
  admin: fromAdmin.AdminState;
  mama: fromMama.MamaState;
  router: RouterState;
}

export type User = Record<'id' | 'name', number | string>;
export type Users = User[];

export interface AppState {
  app: string | Users;
}

export const initialAppState: AppState = {
  app: 'abc',
};

export const reducer: ActionReducer<AppState> = createReducer(
  initialAppState,
  on(
    appActions.loadApps,
    (
      state: AppState,
      action: TypedAction<'[App] Load Apps'> & { type: '[App] Load Apps' }
    ): AppState => {
      console.log('reducer:loadApps');
      console.dir(action);
      console.log(state);

      // strictStateImmutability: true
      // state.app = '#############';

      return {
        ...state,
        app: 'xxx',
      };
    }
  ),
  on(
    appActions.loadAppsConfig,
    (
      state: AppState,
      action: {
        app: string | Users;
      } & TypedAction<'[App] Load Apps Config'> & {
          type: '[App] Load Apps Config';
        }
    ): AppState => {
      console.log('reducer:loadApps');
      console.dir(action);
      console.log(state);

      return {
        ...state,
        app: action.app,
      };
    }
  )
);

export const reducers: ActionReducerMap<State> = {
  app: reducer,
  admin: fromAdmin.reducers,
  mama: fromMama.reducers,
  router: routerReducer,
};

// const rollbar: Rollbar = new Rollbar(RollbarErrorHandler.ROLLBAR_CONFIG);

export function loggerDev(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State | undefined, action: Action) => {
    // rollbar.info('User opened the app in -DEV-', { state, action });

    return reducer(state, action);
  };
}

export function loggerProd(
  reducer: ActionReducer<State>
): ActionReducer<State> {
  return (state: State | undefined, action: Action) => {
    // rollbar.info('User opened the app in -PROD-', { state, action });

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = isDevMode()
  ? [loggerDev]
  : [loggerProd]; // Runs before normal reducers
