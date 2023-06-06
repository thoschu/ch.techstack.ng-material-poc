import { Injectable } from '@angular/core';
import { prop } from 'ramda';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private static readonly UPLOAD_URL: URL = new URL('http://localhost:3030/upload');

  constructor() { }

  public sendVideoToServer(file: File): Promise<boolean> {
    let formData: FormData = new FormData();

    formData.append('video', file);

    return fetch(HomeService.UPLOAD_URL, {
      method: 'POST',
      body: formData
    })
      .then((response: Response): boolean => prop<boolean, 'ok', Response>('ok', response))
      .catch(error => console.error(error)) as Promise<boolean>;
  };
  public getFirstFile(event: Event): File {
    const target: EventTarget | HTMLInputElement | null = event.target;
    const { files }: { files:  FileList | null } = <HTMLInputElement>target;

    return files!.item(0)!;
  }
}
