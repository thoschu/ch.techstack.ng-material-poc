import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParamsOptions} from '@angular/common/http';
import { Observable } from 'rxjs';

import { PeriodicElement } from './about.component';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private static readonly URL: string = 'http://localhost:3000/periodicElements';

  constructor(private readonly http: HttpClient) {}

  public get periodicElements$(): Observable<PeriodicElement[]> {
    const options: HttpParamsOptions = { };
    // return this.http.get<PeriodicElement[]>(AboutService.URL, {params: new HttpParams().set('id', '1')});
    return this.http.get<PeriodicElement[]>(AboutService.URL, { params: new HttpParams(options) });
  }
}
