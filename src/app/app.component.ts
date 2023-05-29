import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected title: string = 'ng-material-poc';
  protected isLinear: boolean = true;
  protected isOptional: boolean = true;
}
