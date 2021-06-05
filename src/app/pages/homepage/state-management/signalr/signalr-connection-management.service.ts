import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService }       from '../../../../services/auth/auth.service';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalrConnectionManagementService {

    constructor(private authService: AuthService,
                private httpClient: HttpClient) { }

    public async connect() {
        await this.startConnection();
        await this.goOnline();
        await this.notifyOnlineStatus();
    }

    private connection: signalR.HubConnection;

    private async startConnection(): Promise<void>{
        this.buildConnection();
        try {
            await this.connection.start();
        } catch(err) {
            console.log(err);
        }
    }

    private buildConnection() {
        this.connection = new signalR.HubConnectionBuilder()
                        .withUrl("http://localhost:8080/signaling", {
                            accessTokenFactory: () => {
                                return this.authService.token;
                            }
                        })
                        .build();
    }


    private async goOnline(): Promise<void> {
    let url = "http://localhost:8080/api/v1/go-online";
    let header = { Authorization: `Bearer ${this.authService.token}` };
    let connectionId = await this.connection.invoke("GetConnectionId")
    this.httpClient.post(url, {roomCode: this.authService.room, connectionId: connectionId},
                         {headers: header}).subscribe(
                            data => console.log(data),
                            err  => console.log(err)
                         )
    }

    private async notifyOnlineStatus(): Promise<void> {
        try { 
            await this.connection.invoke("NotifyOnlineStatus");
        } catch (err){ 
            console.log(err);
        }
    }
}
