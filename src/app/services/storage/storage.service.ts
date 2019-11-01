import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  addSessionKey(sessionKey: string) {
    sessionStorage.setItem('sessionKey', sessionKey);
  }

  clearStorage() {
    sessionStorage.clear();
  }
}
