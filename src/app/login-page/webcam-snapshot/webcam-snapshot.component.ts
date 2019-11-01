import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { FaceRecognitionService } from '../../services/face-recognition/face-recognition.service';
import { ConfidenceVerificationService } from '../../services/confidence-verification/confidence-verification.service';

@Component({
  selector: 'app-webcam-snapshot',
  templateUrl: './webcam-snapshot.component.html',
  styleUrls: ['./webcam-snapshot.component.scss']
})
export class WebcamSnapshotComponent implements OnInit {
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();

  isPictureTaken = false;
  webcamImage: WebcamImage = null;

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

  constructor(private faceRecognitionService: FaceRecognitionService,
              private verificationService: ConfidenceVerificationService) {
  }

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
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
    this.webcamImage = null;
    this.isPictureTaken = false;
  }

  handleLogin() {
    this.faceRecognitionService.detectImage(this.webcamImage)
      .subscribe((data: FaceIdentificationResponse) => {
        this.verificationService.navigateIfConfident(data);
      });
  }
}
