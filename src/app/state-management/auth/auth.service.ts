import { Injectable }      from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import { User }            from '../../models/user.model';
import { Router }          from '@angular/router';
import { Token }           from '../../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private   http: HttpClient,
              private router:     Router) { }
     
  public token: string;
  public room: string;
  public userIdentifier: string;

  public setToken(user: User, room: string): void{ 
      let url: string = "http://localhost:5000/home/get-token";

      this.http.post<Token>(url, user).subscribe(
      res => {
        this.token = res.jwt;
        this.router.navigate(["/main/" + room]);
      },
      err => {
        console.log(err);
      });
  }
}
