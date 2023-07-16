import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { AppResolver } from './app.resolver';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { MamaComponent } from './mama/mama.component';
import { /*UserGuard,*/ userGuard, userGuardAlwaysTrue } from './user/user.guard';

@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutingModule.ROUTES, AppRoutingModule.CONFIG)
  ],
  exports: [RouterModule],
  providers: [AppResolver]
})
export class AppRoutingModule {
  private static readonly CONFIG: ExtraOptions = { useHash: false };
  private static readonly ROUTES: Routes = [
    {
      path: 'user',
      component: UserComponent,
      canActivate: [userGuard, userGuardAlwaysTrue]
    },
    {
      path: 'mama',
      component: MamaComponent,
      resolve: {
        base: AppResolver
      }
    },
    { path: 'admin', component: AdminComponent }, // eagerly loaded
    { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) }, // lazy loaded
    { path: '**', redirectTo: 'mama' }
  ];
  constructor() {
    console.log('AppRoutingModule constructor');
  }
}
