import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user = new BehaviorSubject<User>({userName: '', groupName: '', personId: ''});
  constructor() { }

  updateUser(userFaceId: string) {
    this.user.next({userName: 'Filip', groupName: 'filip-group', personId: userFaceId});
  }
}
