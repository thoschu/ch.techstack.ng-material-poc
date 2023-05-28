import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { ErrorHandler, Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { NgLetterCountModule } from 'ng-letter-count-2';
import Rollbar, { Configuration } from 'rollbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';
import packageDotJson from '../../package.json';

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  public static readonly RollbarServiceInjectionToken: InjectionToken<Rollbar> = new InjectionToken<Rollbar>('rollbar');
  private static readonly ROLLBAR_CONFIG: Configuration = {
    accessToken: '987a946401c943b79a4d3e965e3579e8',
    captureUncaught: true,
    captureUnhandledRejections: true,
    captureEmail: true,
    captureIp: true,
    captureUsername: true,
    environment: environment.name,
    enabled: !environment.production,
    ignoredMessages: [],
    payload: {
      code_version: packageDotJson.version,
      custom_data: '13',
      environment: 'dev',
      context: 'private',
      server: {}
    }
  };

  constructor(
    @Inject(RollbarErrorHandler.RollbarServiceInjectionToken) private readonly rollbar: Rollbar
  ) {}

  public handleError(err: Record<'originalError', Error> & Error) : void {
    this.rollbar.error(err.originalError || err);
  }

  public static rollbarFactory(): Rollbar {
    return new Rollbar(RollbarErrorHandler.ROLLBAR_CONFIG);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    NgLetterCountModule,
    NgOptimizedImage
  ],
  providers: [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: RollbarErrorHandler.RollbarServiceInjectionToken, useFactory: RollbarErrorHandler.rollbarFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    document.addEventListener('visibilitychange', (event: Event): void => {
      const { hidden }: { hidden: boolean } = document;

      if (hidden) {
        console.log('🔒');
      } else {
        console.log(event);
      }
    });
  }
}
