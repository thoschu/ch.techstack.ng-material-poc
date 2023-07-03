import { createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { MamaState } from './reducers';
import { State } from '../reducers';
import { AdminState } from '../admin/reducers';

export const mamaFeatureSelector: MemoizedSelector<object, MamaState, DefaultProjectorFn<MamaState>> =
  createFeatureSelector<MamaState>('mama');
export const adminFeatureSelector: MemoizedSelector<object, AdminState, DefaultProjectorFn<AdminState>> =
  createFeatureSelector<AdminState>('admin');

export const userSelector: MemoizedSelector<State, string, (s1: MamaState, s2: AdminState) => string> = createSelector(
  mamaFeatureSelector,
  // (state: State) => state.admin,
  adminFeatureSelector,
  (mamaState: MamaState, adminState: AdminState): string => {

    console.log(mamaState);
    console.log(adminState);

    return `${mamaState.mama}:${adminState.admin.name}`
  }
);
