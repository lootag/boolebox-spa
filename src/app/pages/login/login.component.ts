import { Component, OnInit } from '@angular/core';
import { AuthService }       from '../../services/auth/auth.service';
import { User }              from '../../models/user.model';
import { Token }             from '../../models/token.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onLogin(): void {
   let user = this.getUser();
   let room = this.getRoom();
   this.authService.setToken(user, room);
   this.authService.room = room;
   this.authService.userIdentifier = user.email;
  }

  getUser(): User {
    let email    =
        (<HTMLInputElement>document.getElementById("email")).value;
    let password =
        (<HTMLInputElement>document.getElementById("password")).value;
    
    let user: User = {email: email, password: password};
    return user;
  }

  getRoom(): string {
    let room     =
        (<HTMLInputElement>document.getElementById("room")).value;
    return room;
  }

}
