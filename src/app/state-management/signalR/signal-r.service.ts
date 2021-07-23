import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

    constructor(private httpClient: HttpClient) { }

    public connection: signalR.HubConnection;

    public async connect(token: string, roomCode: string) {
        await this.startConnection(token);
        await this.goOnline(token, roomCode);
    }

    public buildConnection(token: string) {
        this.connection = new signalR.HubConnectionBuilder()
                        .withUrl("http://localhost:8080/signaling", {
                            accessTokenFactory: () => {
                                return token;
                            }
                        })
                        .build();
    }

    private async startConnection(token: string): Promise<void>{
        try {
            await this.connection.start();
        } catch(err) {
            console.log(err);
        }
    }



    private async goOnline(token: string, roomCode: string): Promise<void> {
    let url = "http://localhost:8080/api/v1/go-online";
    let header = { Authorization: `Bearer ${token}` };
    let connectionId = await this.connection.invoke("GetConnectionId")
    this.httpClient.post(url, {roomCode: roomCode, connectionId: connectionId}, {headers: header}).subscribe(
                            data => console.log(data),
                            err  => console.log(err)
                         )
    }
}
