import { Component, Inject, OnInit } from '@angular/core';
import Rollbar from 'rollbar';
import { RollbarErrorHandler } from "./app.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  protected title: string = 'ng-material-poc';

  constructor(
    @Inject(RollbarErrorHandler.RollbarServiceInjectionToken) private readonly rollbar: Rollbar
  ) {
    // https://web.dev/constructable-stylesheets/
    const sheet: CSSStyleSheet = new CSSStyleSheet();
    console.log(sheet);
  }

  ngOnInit(): void {
    this.rollbar.info(this.title)
  }
}
