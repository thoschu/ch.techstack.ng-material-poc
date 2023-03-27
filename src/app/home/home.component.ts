import { Component, Inject } from '@angular/core';
import { NgLetterCountPipe } from 'ng-letter-count-2';
import Rollbar from 'rollbar';
import { RollbarErrorHandler } from "../app.module";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ NgLetterCountPipe ]
})
export class HomeComponent {
  public title = 'AppComponent by Tom S.';

  constructor(
    @Inject(RollbarErrorHandler.RollbarServiceInjectionToken) private readonly rollbar: Rollbar,
    private readonly ngLetterCountPipe: NgLetterCountPipe
  ) {
    rollbar.log('HomeComponent');
    console.log(ngLetterCountPipe.transform(this.title, '-w'));
  }
}
