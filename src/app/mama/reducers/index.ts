import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector, createReducer,
  createSelector,
  MetaReducer, on
} from '@ngrx/store';
import {AdminState} from '../../admin/reducers';
import { mamaActions } from '../mama.actions';
import {TypedAction} from "@ngrx/store/src/models";

export const mamaFeatureKey: 'mama' = 'mama';

export interface MamaState {
  mama: string;
}

export const initialMamaState: MamaState = {
  mama: 'mama'
};

export const reducers: ActionReducer<MamaState> = createReducer(
  initialMamaState,
  on(mamaActions.loadMamas,
    (state: MamaState) => {
      console.log(state);

      return state;
    }
  ),
  on(mamaActions.loadMamasSuccess,
    (state: MamaState, action: { mama: string } & TypedAction<'[Mama] Load Mamas Success'> & {type: '[Mama] Load Mamas Success'}  ): MamaState => {
      return {
        mama: action.mama
      };
    }
  )
);

// export const reducers2: ActionReducerMap<MamaState> = {
//   mama: undefined
// };


export const metaReducers: MetaReducer<MamaState>[] = isDevMode() ? [] : [];
