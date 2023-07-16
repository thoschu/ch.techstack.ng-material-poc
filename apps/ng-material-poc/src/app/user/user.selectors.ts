import {
  createFeatureSelector,
  createSelector,
  DefaultProjectorFn,
  MemoizedSelector,
} from '@ngrx/store';

import { State } from '../reducers';
import { AdminState } from '../admin/reducers';
import { IAdmin } from '../admin/admin.model';

export const userFeatureSelector: MemoizedSelector<
  object,
  AdminState,
  DefaultProjectorFn<AdminState>
> = createFeatureSelector<AdminState>('admin');

export const userSelector: MemoizedSelector<
  State,
  string,
  (s1: AdminState) => string
> = createSelector(
  //(state: State) => state.admin,
  userFeatureSelector,
  (adminState: AdminState) => {
    const { admin }: { admin: IAdmin<number> } = adminState;
    const { name }: { name: string } = admin;

    return name;
  }
);
