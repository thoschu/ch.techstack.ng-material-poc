import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, distinctUntilChanged, map, noop, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

import { AdminService } from './admin.service';
import { Admin, IAdmin } from './admin.model';
import { setAdminActionCreator, adminActions } from './admin.actions';
import { AdminState } from './reducers';
import { State } from '../reducers';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly randomAdminId: number;
  protected admin$!: Observable<string>;
  protected isMale: boolean = true;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly adminService: AdminService,
    private readonly store: Store<State>
  ) {
    const randomNumber: number = Math.random();
    const randomNumberMax: number = randomNumber * 2;
    this.randomAdminId = Math.floor(randomNumberMax) + 1;

    this.adminService.getAdmin(this.randomAdminId)
      .pipe(
        tap((admin: Admin<number>): void => {
          // console.log(admin);
          // this.store.dispatch( { type: 'Admin Action', payload: { admin } });

          const props: Record<'admin', Admin<number>> = { admin };
          const adminAction: Record<'admin', Admin<number>> & TypedAction<'[Admin Page] SetAdmin Action'> = setAdminActionCreator(props);
          // this.store.dispatch(adminAction);

          // this.store.dispatch(setAdminActionCreator({ admin }));

          const setAdminAction: { admin: Admin<number>} & TypedAction<'[Admin Page] SetAdmin Action'> = adminActions.setAdminAction({ admin });

          this.store.dispatch(setAdminAction);
        }),
        catchError((err: Error, caught: Observable<Admin<number>>) => caught)
      )
      .subscribe(noop);
  }

  ngOnInit(): void {
    this.admin$ = this.store
      .pipe(map((state: State): AdminState => state.admin))
      .pipe(map((adminState: AdminState): IAdmin<number> => adminState.admin))
      .pipe(tap((admin: IAdmin<number>): void => {
        this.isMale = admin.id === 1;
      }))
      .pipe(map((admin: IAdmin<number>): string => admin.name))
      .pipe(distinctUntilChanged());

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    const deleteAdminAction: TypedAction<'[Admin Page] DeleteAdmin Action'> = adminActions.deleteAdminAction();

    this.store.dispatch(deleteAdminAction);
  }
}
