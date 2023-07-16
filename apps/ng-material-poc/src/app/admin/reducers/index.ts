import { isDevMode } from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

import { Admin, IAdmin } from '../admin.model';
import { adminActions } from '../admin.actions';
import { MamaState } from '../../mama/reducers';

export const adminFeatureKey: 'admin' = 'admin';

export interface AdminState {
  admin: IAdmin<number>;
}

export const initialAdminState: AdminState = {
  admin: { id: 0, name: 'nobody' },
};

export const reducers: ActionReducer<AdminState> = createReducer(
  initialAdminState,
  on(
    adminActions.setAdminAction,
    (
      state: AdminState,
      action: {
        admin: Admin<number>;
      } & TypedAction<'[Admin Page] SetAdmin Action'> & {
          type: '[Admin Page] SetAdmin Action';
        }
    ): AdminState => {
      console.log(state);
      return {
        admin: action.admin,
      };
    }
  ),
  on(adminActions.deleteAdminAction, (state: AdminState): AdminState => {
    const { admin }: { admin: IAdmin<number> } = state;
    const { name }: { name: string } = admin;

    const newAdmin: Admin<number> = new Admin(0, `${name} (deleted)`);

    return {
      admin: newAdmin,
    };
  })
);

export const metaReducers: MetaReducer<AdminState>[] = isDevMode() ? [] : [];
