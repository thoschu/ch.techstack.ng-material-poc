import { ModuleWithProviders, NgModule } from '@angular/core';
import { ExtraOptions, NoPreloading, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";

@NgModule({
  imports: [
    RouterModule.forRoot(
      AppRoutingModule.ROUTES,
      AppRoutingModule.ROUTES_CONFIG
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  private static ROUTES_CONFIG: ExtraOptions = {
    useHash: false,
    enableTracing: true,
    preloadingStrategy: NoPreloading
  };
  private static ROUTES: Routes = [{
    path: 'home',
    component: HomeComponent
  }, {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }, {
    path: '**',
    redirectTo: '/home'
  }];

  public static forRoot(): ModuleWithProviders<AppRoutingModule> {
    return {
      ngModule: AppRoutingModule,
      providers: []
    }
  }
}
