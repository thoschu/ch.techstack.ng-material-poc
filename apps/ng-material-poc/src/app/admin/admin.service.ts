import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { find, propEq } from 'ramda';

import { Admin, IAdmin } from './admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private static readonly USERS_URL: string =
    'http://localhost:3100/api/users/';

  constructor(private readonly httpClient: HttpClient) {}

  public getAdmin(id: number): Observable<Admin<number>> {
    return this.httpClient.get<IAdmin<number>[]>(AdminService.USERS_URL).pipe(
      map<IAdmin<number>[], Admin<number>>(
        (users: IAdmin<number>[]): Admin<number> => {
          const admin: IAdmin<number> | undefined = find<IAdmin<number>>(
            propEq<'id'>(id, 'id')
          )(users);
          const { id: adminId, name }: { id: number; name: string } = admin ?? {
            id: 0,
            name: 'nobody',
          };

          return new Admin(adminId, name);
        }
      )
    );
  }
}
