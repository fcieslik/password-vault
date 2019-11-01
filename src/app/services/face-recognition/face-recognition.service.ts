import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { WebcamImage } from 'ngx-webcam';
import { mergeMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {

  baseUrl = 'https://facerecognitionpasswordvault.cognitiveservices.azure.com/face/v1.0';
  personGroupId = 'filip-group';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': '7bde2c45461d41768f29cc28f9616b6d'
    })
  };
  constructor(private httpClient: HttpClient) { }

  detectImage(image: WebcamImage): Observable<FaceIdentificationResponse> {
    const headers = this.getHeaders();
    const params = this.getParams();
    const blob = this.makeblob(image.imageAsDataUrl);

    return this.httpClient.post<FaceRecognitionResponse>(
      `${this.baseUrl}/detect`,
      blob,
      {
        params,
        headers
      }
    ).pipe(
      mergeMap(data => this.identify(this.personGroupId, data[0].faceId)),
    );
  }

  identify(personGroupId, faceId): Observable<FaceIdentificationResponse> {
    const request = {
      personGroupId,
      faceIds: [faceId],
      maxNumOfCandidatesReturned: 1,
      confidenceThreshold: 0.4
    };
    return this.httpClient.post<FaceIdentificationResponse>(`${this.baseUrl}/identify`, request, this.httpOptions);
  }

  private makeblob(dataURL) {
    const BASE64_MARKER = ';base64,';
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  private getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/octet-stream');
    headers = headers.set('Ocp-Apim-Subscription-Key', '7bde2c45461d41768f29cc28f9616b6d');

    return headers;
  }

  private getParams() {
    const httpParams = new HttpParams()
      .set('returnFaceId', 'true')
      .set('returnFaceLandmarks', 'false')
      .set(
        'returnFaceAttributes',
        'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
      );

    return httpParams;
  }
}
