import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public static videoSrc: string | ArrayBuffer | null = null;
  public classReference = HomeComponent;

  @ViewChild('fileInput') private fileInput!: ElementRef;
  constructor() { }

  protected handleFile(video: HTMLVideoElement): void {
    const file = this.fileInput.nativeElement.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = function(event: ProgressEvent<FileReader>): void {
      HomeComponent.videoSrc = event.target!.result;
      video.load();
    };

    reader.readAsDataURL(file);
  }
}
