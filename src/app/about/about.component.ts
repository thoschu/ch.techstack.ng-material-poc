import { Component } from '@angular/core';
import { Navigation, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  constructor(private readonly router: Router) {
    this.router.events.pipe(filter((e: unknown): boolean => {
      console.log(e);
      return e instanceof NavigationStart;
    })).subscribe(e => {
      const navigation: Navigation | null = this.router.getCurrentNavigation();

      console.log(navigation?.extras.state?.['tracingId']);
    });
  }
}
