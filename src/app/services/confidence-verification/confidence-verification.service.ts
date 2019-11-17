import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ConfidenceVerificationService {

  userFaceId = 'fb606d4b-b003-4d5c-807b-1fd2653293a0';
  confidenceLevel = 0.6500;

  constructor(private router: Router,
              private storage: StorageService,
              private userService: UserService) {
  }

  navigateIfConfident(faceIdentityResponse: FaceIdentificationResponse) {
    const candidate = faceIdentityResponse[0].candidates[0];
    if (candidate) {
      this.verifyConfidence(candidate);
    } else {
      this.handleNoCandidate();
    }
  }

  private verifyConfidence(candidate: FaceRecognitionCandidate) {
    if (candidate.personId === this.userFaceId && candidate.confidence >= this.confidenceLevel) {
      this.storage.addSessionKey(candidate.personId);
      this.userService.updateUser(this.userFaceId);
      this.router.navigate(['dashboard']);
    } else {
      this.handleNoCandidate();
    }
  }

  private handleNoCandidate() {
    this.router.navigate(['error', 'not-allowed']);
  }
}
