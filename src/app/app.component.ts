import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected title: string = 'ng-material-poc';
  mode: FormControl<'over' | 'push' | 'side' | null> = new FormControl('side' as MatDrawerMode);
}
