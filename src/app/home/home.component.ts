import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { createFFmpeg, CreateFFmpegOptions, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { nanoid } from 'nanoid'
import { prop } from 'ramda';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private downloadLink: HTMLAnchorElement | null = null;
  protected downloadActive: boolean = false;
  protected progressBarValue: number = 0;
  public static videoSrc: SafeUrl;
  public classReference: typeof HomeComponent = HomeComponent;

  @ViewChild('videoElement') private videoElement!: ElementRef;
  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly renderer2: Renderer2
  ) {}

  private getFirstFile(event: Event): File {
    const target: EventTarget | HTMLInputElement | null = event.target;
    const { files }: { files:  FileList | null } = <HTMLInputElement>target;

    return files!.item(0)!;
  }

  protected async transcode(event: Event): Promise<void> {
    const firstFile: File = this.getFirstFile(event);
    const { name, type }: { name: string, type: string } = firstFile;

    if(type !== 'video/mp4') {
      const options: CreateFFmpegOptions = {
        log: true,
        progress: (progressParams: { ratio: number }): void => {
          this.progressBarValue = progressParams.ratio * 100;
        }
      };
      const ffmpeg: FFmpeg = createFFmpeg(options);

      await ffmpeg.load();

      const dataUint8Array: Uint8Array = await fetchFile(firstFile);
      const outputName: string = `${name}.mp4`;

      ffmpeg.FS('writeFile', name, dataUint8Array);

      await ffmpeg.run('-i', name, outputName);

      const data: Uint8Array = ffmpeg.FS('readFile', outputName);
      const { buffer }: { buffer: ArrayBuffer } = data;
      const blobParts: BlobPart[] = [buffer];
      const blobOptions: BlobPropertyBag = { type: 'videos/mp4' };
      const blob: Blob = new Blob(blobParts, blobOptions);
      const fileName: string = `${nanoid()}.${outputName}`;

      const file: File = new File([buffer], fileName, {
        type: 'videos/mp4'
      });
      const dangerousUrl: string = URL.createObjectURL(blob);
      HomeComponent.videoSrc = this.sanitizer.bypassSecurityTrustUrl(dangerousUrl);

      const video: HTMLVideoElement = this.videoElement.nativeElement;
      video.load();

      this.sendVideoToServer(file).then((result: boolean): void => {
        if(result) {
          video.play();

          this.downloadLink = this.renderer2.createElement('a');
          this.renderer2.setAttribute(this.downloadLink, 'href', dangerousUrl);
          this.renderer2.setAttribute(this.downloadLink, 'download', fileName);

          this.downloadActive = true;
        }
      });

    } else {
      const reader: FileReader = new FileReader();

      reader.readAsDataURL(firstFile);

      reader.onload = (event: ProgressEvent<FileReader>): void => {
        HomeComponent.videoSrc = event.target!.result as SafeUrl;

        const video: HTMLVideoElement = this.videoElement.nativeElement;

        video.load();

        const options: FilePropertyBag = { type: firstFile.type };
        const file: File = new File([firstFile], `${nanoid()}.${firstFile.name}`, options);

        this.sendVideoToServer(file)
          .then((result: boolean): void => {
            if (result) {
              video.play();
              this.downloadActive = true;
            }
          });
      };
    }
  };

  private sendVideoToServer(file: File): Promise<boolean> {
    let formData: FormData = new FormData();

    formData.append('video', file);

    return fetch('http://localhost:3030/upload', {
      method: 'POST',
      body: formData
    })
      .then((response: Response): boolean => prop<boolean, 'ok', Response>('ok', response))
      .catch(error => console.error(error)) as Promise<boolean>;
  };

  protected downloadVideo(): void {
    this.downloadLink!.click();
  }

  protected openVideoList(): void {
    const baseUrl: string = 'http://192.168.188.65:8080/';
    const url: URL = new URL(baseUrl);

    window.open(url);
  }
}
