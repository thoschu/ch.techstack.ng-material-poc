import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { createFFmpeg, CreateFFmpegOptions, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { nanoid } from 'nanoid'
import { equals, product } from 'ramda';
import { io, Socket } from 'socket.io-client';

import { HomeService } from "./home.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private downloadLink: HTMLAnchorElement | null = null;
  protected downloadActive: boolean = false;
  protected progressBarValue: number = 0;
  public static videoSrc: SafeUrl | null = null;
  public classReference: typeof HomeComponent = HomeComponent;

  @ViewChild('videoElement') private videoElement!: ElementRef;
  @ViewChild('webRtcElementLocal') private webRtcElementLocal!: ElementRef;
  @ViewChild('webRtcElementRemote') private webRtcElementRemote!: ElementRef;
  @ViewChild('webRtcElementContainer') private webRtcElementContainer!: ElementRef;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly renderer2: Renderer2,
    private readonly route: ActivatedRoute,
    private readonly homeService: HomeService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.route.url.subscribe(([url]: UrlSegment[]): void => {
      const { path }: { path: string } = url;
      const trustedUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(`videos/${path}`);

      HomeComponent.videoSrc = equals<string>(path, 'home') ? null : trustedUrl;
    });
  }

  async ngAfterViewInit() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const socket: Socket = io('https://aa92-77-20-121-222.ngrok-free.app');
    video.muted = true;

    const videoPlayPromise: Promise<void> = video.play();

    videoPlayPromise
      .then((): void => {
        video.pause();
        video.addEventListener('play', (event: Event): void => {
          video.muted = !event.isTrusted;
        });
      })
      .catch((error: Error) => console.error(error));

    // WebRTC-Signalisierung - Angebot senden
    const peerConnection: RTCPeerConnection = new RTCPeerConnection();
    //const peerConnectionDataChannel: RTCDataChannel = peerConnection.createDataChannel("channel-one");
    const room: string = 'mov-room';

    // Verbindungsherstellung mit dem Socket.io-Server
    socket.on('connect', (): void => {
      console.log('Verbunden mit dem Server:', io.name);

      this.document.defaultView!
        .navigator.mediaDevices
        .getUserMedia({video: true, audio: true})
        .then((stream: MediaStream): void => {
          const user: string = nanoid();
          this.webRtcElementLocal.nativeElement.srcObject = stream;

          stream.getTracks()
            .forEach((track: MediaStreamTrack): RTCRtpSender => peerConnection.addTrack(track, stream));

          socket.emit('join', {room, user}); // Raum beitreten

          peerConnection.addEventListener('negotiationneeded', async (event: Event): Promise<void> => {
            const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', {room, offer});
          });

          peerConnection.addEventListener(
            'track',
            (event: RTCTrackEvent): void => {
              console.log('#peerConnection.ontrack');
              console.dir(event);

              event.streams.forEach((stream: MediaStream): void => {
                const video: HTMLVideoElement = this.renderer2.createElement('video');
                this.renderer2.setAttribute(video, 'muted', 'true');
                this.renderer2.setAttribute(video, 'autoplay', 'true');
                this.renderer2.setProperty(video, 'srcObject', stream);
                // this.renderer2.appendChild(this.webRtcElementContainer.nativeElement, video);
              });

              this.webRtcElementRemote.nativeElement.srcObject = event.streams[0];
            },
            false
          );

          peerConnection.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent): void => {
            const {candidate}: { candidate: RTCIceCandidate | null } = event;

            if (candidate) {
              socket.emit('iceCandidate', { room, candidate });
            }
          });
        })
        .catch((error: Error): void => {
          console.error(`Fehler bei der Stream-Einrichtung: ${error}`);
        });
    });

    socket.on('offer', async (offer: RTCSessionDescriptionInit): Promise<void> => {
      await peerConnection.setRemoteDescription(offer);

      const answer: RTCSessionDescriptionInit = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit('answer', {room, answer});
    });

    socket.on('answer', async (answer: RTCSessionDescriptionInit): Promise<void> => {
      await peerConnection.setRemoteDescription(answer);
    });

    socket.on('iceCandidate', async (candidate): Promise<void> => {
      await peerConnection.addIceCandidate(candidate);
    });
  }

  private async convertToUint8ArrayWithFfmpeg(firstFile: File, name: string): Promise<Uint8Array> {
    const options: CreateFFmpegOptions = {
      log: true,
      progress: (progressParams: { ratio: number }): void => {
        this.progressBarValue = product([progressParams.ratio, 100]);
      }
    };
    const ffmpeg: FFmpeg = createFFmpeg(options);

    await ffmpeg.load();

    const dataUint8Array: Uint8Array = await fetchFile(firstFile);
    const outputName: string = `${name}.mp4`;

    ffmpeg.FS('writeFile', name, dataUint8Array);

    await ffmpeg.run('-i', name, outputName);

    return ffmpeg.FS('readFile', outputName);
  }

  protected async transcode(event: Event): Promise<void> {
    const firstFile: File = this.homeService.getFirstFile(event);
    const { name, type }: { name: string, type: string } = firstFile;

    if(type !== 'video/mp4') {
      const outputName: string = `${name}.mp4`;
      const data: Uint8Array = await this.convertToUint8ArrayWithFfmpeg(firstFile, name);

      const { buffer }: { buffer: ArrayBuffer } = data;
      const blobParts: BlobPart[] = [buffer];
      const blobOptions: BlobPropertyBag = { type: 'videos/mp4' };
      const blob: Blob = new Blob(blobParts, blobOptions);
      const fileName: string = `${nanoid()}.${outputName}`;

      const file: File = new File([buffer], fileName, { type: 'videos/mp4' });
      const dangerousUrl: string = URL.createObjectURL(blob);
      HomeComponent.videoSrc = this.sanitizer.bypassSecurityTrustUrl(dangerousUrl);

      const video: HTMLVideoElement = this.videoElement.nativeElement;
      video.load();

      this.homeService.sendVideoToServer(file).then((result: boolean): void => {
        if(result) {
          video.play();

          this.downloadLink = this.renderer2.createElement('a');
          this.renderer2.setAttribute(this.downloadLink, 'href', dangerousUrl);
          this.renderer2.setAttribute(this.downloadLink, 'download', fileName);

          this.downloadActive = true;

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
              console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
            });
          } else {
            alert("Geolocation is not supported by this browser.");
          }
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

        this.homeService.sendVideoToServer(file)
          .then((result: boolean): void => {
            if (result) {
              video.play();
              this.downloadActive = true;
            }
          });
      };
    }
  };

  protected downloadVideo(): void {
    this.downloadLink!.click();
  }

  protected openVideoList(): void {
    document.location.href='/videos'
  }
}
