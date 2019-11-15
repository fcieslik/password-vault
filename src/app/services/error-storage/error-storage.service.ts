import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorStorageService {

  constructor() { }

  storeError(errorMessage: string) {
    sessionStorage.setItem('httpError', errorMessage);
  }

  clearError() {
    sessionStorage.removeItem('httpError');
  }
}
