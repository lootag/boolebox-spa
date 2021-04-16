import { Component, OnInit } from '@angular/core';
import { AuthService }       from '../../services/auth/auth.service';
import { SingnalingService } from '../../services/signaling/singnaling.service';
import { IceService }        from '../../services/ice/ice.service';
import { BehaviorSubject }   from 'rxjs';
import * as signalR from "@aspnet/signalr";
import { ActivatedRoute } from '@angular/router'
import * as adapter from '../../../assets/js/adapter-latest.js';
import { WebRTCAdaptor } from '../../../assets/js/webrtc-adaptor.js';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private authService: AuthService,
              private signalingService: SingnalingService,
              private iceService: IceService,
              private route      : ActivatedRoute) { }
  public  toDisplay: string = "";
  public  loggedUsers: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private connection: signalR.HubConnection;
  private parameters: any;
  private otherUser: string;
  private webRTCAdaptor: WebRTCAdaptor;
  private streamId: string;
  public  wsIsConnected: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public  joined: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    async ngOnInit(): Promise<void> {
        //this.connection = this.buildConnection();
        //await this.startConnection();
        //await this.signalingService.goOnline(this.connection, this.authService.room,
                                       //this.authService.token)
        //this.setRouteParameters();
        /*
        let localVideo = <HTMLVideoElement>document.querySelector("#localVideo")
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true})
                .then(stream => {
                  localVideo.srcObject = stream;
                })
                .catch(err => {
                  console.log(err);
                })
        }
        */
        this.createWebRTCAdaptor();
    }

    public async onSubmit(): Promise<void>{
    let message = (<HTMLInputElement>document.getElementById("myCoolText")).value;
    let user    = (<HTMLInputElement>document.getElementById("user")).value;

    try {
        await this.connection.invoke("SendMessageToUser",user, message);
    } catch (err){
        console.log(err);
    }
 }

 private buildConnection(): signalR.HubConnection {
    let connection = new signalR.HubConnectionBuilder()
                      .withUrl("http://localhost:8080/signaling", {
                        accessTokenFactory: () => {
                            return this.authService.token;
                        }
                      })
                      .build();
    connection.on("ReceiveMessageFromUser", data => {
        this.toDisplay = data
    });

    connection.on("ReceiveOnlineUsers", data => {
        let onlineUsers = data.filter(u => u != this.authService.userIdentifier);
        this.otherUser = onlineUsers[0];
        this.loggedUsers.next(onlineUsers);
    });
    return connection;
 }
 private async startConnection(): Promise<void>{
    try {
        await this.connection.start();
    } catch(err) {
        console.log(err);
    }
 }

 private async notifyOnlineStatus(): Promise<void> {
     try { 
        await this.connection.invoke("NotifyOnlineStatus");
     } catch (err){ 
        console.log(err);
     }
 }

 private setRouteParameters(): void {
    this.route.params.subscribe(
        data => this.parameters = data,
        err  => console.log(err)
    );
 }

 private  createWebRTCAdaptor(): void {

    var pc_config = {
        'iceServers' : [ {
            'urls' : 'stun:stun1.l.google.com:19302'
        } ]
    };

    let sdpConstrains = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false 
    }
    let mediaConstraints = {
        video: true,
        audio: true
    }

    
    this.webRTCAdaptor = new WebRTCAdaptor({
        websocket_url : "ws://52.232.122.122:5080/WebRTCAppEE/websocket",
        mediaConstraints: mediaConstraints,
        peerconnection_config: pc_config,
        sdp_constraints: sdpConstrains,
        localVideoId: "localVideo",
        debug: true,
        bandwidth:1000,
        callback: (info, obj) => {
            if (info === "initialized") {
                let value = this.wsIsConnected.value;
                this.wsIsConnected.next(value + 1);
                (<HTMLVideoElement>document.getElementById("localVideo")).muted = true;
            } 
            else if (info == "joinedTheRoom") {
                this.streamId = obj.streamId;
                this.joined.next(true);
                this.webRTCAdaptor.publish(this.streamId, null);
                //this.webRTCAdaptor.play(streamsToPlay[0], "remoteVideo");
            }
            else if (info=="started") {
                this.webRTCAdaptor.publish(this.streamId);
            }
            console.log(info);
        },
        callbackError: (err, message) => {
            console.log("There was an error: " + err);
            console.log("There was en error: " + message);
        }
    })
 }

 public onJoin(): void {
    this.webRTCAdaptor.joinRoom("someRoom",
                                this.authService.userIdentifier);	
 }

}
