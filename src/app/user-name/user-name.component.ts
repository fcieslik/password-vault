import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss']
})
export class UserNameComponent implements OnInit {

  userName: string;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userName = this.userService.user.getValue().userName ? this.userService.user.getValue().userName : '';
  }

}
