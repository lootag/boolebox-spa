import { Injectable } from '@angular/core';
import { HttpClient }      from '@angular/common/http';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class SingnalingService {

  constructor(private httpClient: HttpClient) { }


  public async goOnline(connection: signalR.HubConnection, 
                        roomCode: string,
                        token: string): Promise<void> {
    let url = "http://localhost:8080/api/v1/go-online";
    let header = { Authorization: `Bearer ${token}` };
    let connectionId = await connection.invoke("GetConnectionId")
    this.httpClient.post(url, {roomCode: roomCode, connectionId: connectionId},
                         {headers: header}).subscribe(
                            data => console.log(data),
                            err  => console.log(err)
                         )
  }
}
