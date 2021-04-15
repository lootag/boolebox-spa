import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders }      from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IceService {

  public iceServers: any;

  constructor(private httpClient: HttpClient) { }
  
  public getIceCredentials(): void {
    let o = {
        format: "urls"
    }
    let bodyString = JSON.stringify(o);
    let url = "https://global.xirsys.net/_turn/BooleBoxVideoChat";
    let headers = new HttpHeaders();
    headers.append("Authorization", "Basic " + Buffer.from("lootag:3d6bc5d2-9db6-11eb-9c31-0242ac150003").toString("base64"));
    headers.append("Content-Type", "application/json");
    headers.append("Content-Length", bodyString.length.toString());
    this.httpClient.put(url, bodyString, {headers: headers}).subscribe(
        data => {
            this.iceServers = data;
            console.log(this.iceServers);
        },
        err => {
            console.log(err);
        }
    )
  }
}
