import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {PeriodicElement} from "./about.component";

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private readonly http: HttpClient) {
    const req = http.get<PeriodicElement[]>('/api/heroes');
  }
}
