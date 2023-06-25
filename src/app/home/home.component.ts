import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { createFFmpeg, CreateFFmpegOptions, fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import { nanoid } from 'nanoid'
import { equals, product, slice } from 'ramda';
import { io, Socket } from 'socket.io-client';

import { HomeService } from "./home.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly remoteMediaStreams: Set<MediaStream> = new Set<MediaStream>();
  private downloadLink: HTMLAnchorElement | null = null;
  protected downloadActive: boolean = false;
  protected progressBarValue: number = 0;
  public static videoSrc: SafeUrl | null = null;
  public classReference: typeof HomeComponent = HomeComponent;

  @ViewChild('videoElement') private videoElement!: ElementRef;
  @ViewChild('webRtcElementLocal') private webRtcElementLocal!: ElementRef;
  // @ViewChild('webRtcElementRemote') private webRtcElementRemote!: ElementRef;
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
    const socket: Socket = io('http://localhost:3030');
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
          this.renderer2.setProperty(this.webRtcElementLocal.nativeElement, 'id', stream.id);
          this.webRtcElementLocal.nativeElement.srcObject = stream;

          console.info(`Local: ${stream.id}`);

          stream.getTracks().forEach((track: MediaStreamTrack): RTCRtpSender => peerConnection.addTrack(track, stream));

          socket.emit('join', { room, user }); // Raum beitreten

          peerConnection.addEventListener('negotiationneeded', async (event: Event): Promise<void> => {
            const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', { room, offer });
          });

          peerConnection.addEventListener(
            'track',
            (event: RTCTrackEvent): void => {
              console.info(`#peerConnection.ontrack`);
              const { streams }: { streams: ReadonlyArray<MediaStream> } = event;
              const firstStream: MediaStream = streams[0];
              const { id }: { id: string } = firstStream;
              const pureId: string = slice(1, -1, id);

              event.streams.forEach((mediaStream: MediaStream): void => {
                const { id }:{ id: string } = mediaStream;
                const pureId: string = slice(1, -1, id);
                console.log(pureId);
                console.log('--------------------xxx-----------------');

                const alreadyInDom: boolean = this.checkVideoElementsInContainer(pureId);
                console.log(this.checkVideoElementsInContainer(pureId));
                if (!alreadyInDom) {
                  const { nativeElement: webRtcElementContainerElement }: { nativeElement: HTMLDivElement } = this.webRtcElementContainer;
                  const videoTag: HTMLVideoElement = this.renderer2.createElement('video');

                  this.renderer2.setAttribute(videoTag, 'autoplay', 'autoplay');
                  this.renderer2.setProperty(videoTag, 'id', pureId);
                  this.renderer2.setProperty(videoTag, 'srcObject', mediaStream);
                  this.renderer2.appendChild(webRtcElementContainerElement, videoTag);
                }
              });

            },
            false
          );

          peerConnection.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent): void => {
            const { candidate }: { candidate: RTCIceCandidate | null } = event;

            if (candidate) {
              socket.emit('iceCandidate', { room, candidate });
            }
          });

          peerConnection.addEventListener(
            "connectionstatechange",
            (event) => {
              console.log(event);
              console.log(peerConnection);
              const { connectionState }:{ connectionState: RTCPeerConnectionState } = peerConnection;
              console.log(connectionState);
              // console.log(peerConnection.connectionId);

              let remoteDescription = peerConnection.remoteDescription;

              // Extrahieren Sie die ID aus dem SDP
              // let id = extractIDFromSDP(remoteDescription!.sdp);

              console.log(remoteDescription);



              switch (connectionState) {
                case "new":
                  break;
                case "connecting":
                  break;
                case "connected":
                  break;
                case "disconnected":
                  console.log(remoteDescription!.sdp);
                  // a=msid-semantic: WMS {b89a1248-058c-4ec5-b434-f149956279cb}
                  function extractIDFromSDP(sdp: string) {
                    let idStartIndex = sdp.indexOf("{") + 1;
                    let idEndIndex = sdp.indexOf("}", idStartIndex);

                    // Extrahieren Sie die ID
                    let id = sdp.substring(idStartIndex, idEndIndex);

                    return id;
                  }

                  console.log(extractIDFromSDP(remoteDescription!.sdp));

                  // todo
                  break;
                case "closed":
                  break;
                case "failed":
                  break;
                default:
                  break;
              }
            },
            false
          );
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

  private checkVideoElementsInContainer(targetId: string): boolean {
    const { nativeElement: webRtcElementContainerElement }: { nativeElement: HTMLDivElement } = this.webRtcElementContainer;

    if (webRtcElementContainerElement) {
      const videoElements: HTMLCollectionOf<HTMLVideoElement> = webRtcElementContainerElement.getElementsByTagName('video');
      const { length: videoElementsLength }: { length: number } = videoElements;

      for (let i: number = 0; i < videoElementsLength; i++) {
        if (videoElements[i].id === targetId) {
          return true;
        }
      }
    }

    return false;
  }
}
