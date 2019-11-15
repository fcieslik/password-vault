import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, pipe, Subject, Subscription, throwError } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { FaceRecognitionService } from '../../services/face-recognition/face-recognition.service';
import { ConfidenceVerificationService } from '../../services/confidence-verification/confidence-verification.service';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-webcam-snapshot',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss']
})
export class WebcamSnapshotComponent implements OnInit, OnDestroy {
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();

  isPictureTaken = false;
  webcamImage: WebcamImage = null;
  isRecognizing: boolean;

  // cam settings
  public showWebcam = true;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  isVerificationSubscription = new Subscription();

  constructor(private faceRecognitionService: FaceRecognitionService,
              private verificationService: ConfidenceVerificationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.isVerificationSubscription = this.faceRecognitionService.isVerification
      .pipe(
        tap(value => this.isRecognizing = value)
      )
      .subscribe();
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  ngOnDestroy(): void {
    this.isVerificationSubscription.unsubscribe();
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.isPictureTaken = true;
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  resetPicture() {
    this.isPictureTaken = false;
    this.webcamImage = null;
  }

  handleLogin() {
    this.faceRecognitionService.detectImage(this.webcamImage)
      .pipe(
        catchError(err => {
          this.router.navigate(['error', 'recognition-error']);
          return throwError(err);
        })
      )
      .subscribe((data: FaceIdentificationResponse) => {
        this.verificationService.navigateIfConfident(data);
      });
  }

}
