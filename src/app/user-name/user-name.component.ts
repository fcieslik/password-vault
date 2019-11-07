import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss']
})
export class UserNameComponent implements OnInit, OnDestroy {

  userName: string;
  userNameSubscription = new Subscription();
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userName = this.userService.user.getValue().userName ? this.userService.user.getValue().userName : '';
    this.userNameSubscription = this.userService.user.subscribe((user: User) => this.userName = user.userName);
  }

  ngOnDestroy(): void {
    this.userNameSubscription.unsubscribe();
  }

}
