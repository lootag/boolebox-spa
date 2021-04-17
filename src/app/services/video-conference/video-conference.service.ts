import { Injectable } from '@angular/core';
import { WebRTCAdaptor } from '../../../assets/js/webrtc-adaptor.js';
import { AuthService }       from '../../services/auth/auth.service';
import { Stream }  from '../../models/stream.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoConferenceService {

    constructor(private authService: AuthService) { }
    
    private webRTCAdaptor: WebRTCAdaptor;
    private streamId     : string;
    private roomTimerId  : NodeJS.Timeout;
   
    public streams       : BehaviorSubject<Stream[]> = new BehaviorSubject<Stream[]>([]);

    public  createWebRTCAdaptor(): void {

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
                    (<HTMLVideoElement>document.getElementById("localVideo")).muted = true;
                    this.webRTCAdaptor.joinRoom(this.authService.room);	

                } 
                else if (info === "joinedTheRoom") {
                    this.streamId = obj.streamId;
                    this.webRTCAdaptor.publish(this.streamId, null);

                    if (obj.streams.length != 0) {
                        obj.streams.forEach(s => {
                            this.webRTCAdaptor.play(s, null);
                        })
                    }

                    const getRoomInfoIntervalMs = 3000;
                    this.roomTimerId = setInterval(() => {
                    this.webRTCAdaptor.getRoomInfo(this.authService.room,
                                                    this.authService.userIdentifier);
                    }, getRoomInfoIntervalMs) 
                }
                else if (info === "roomInformation") {
                    if (obj.streams.length != 0) {
                        this.webRTCAdaptor.play(obj.streams[0], null);
                    }
                }
                else if (info == "newStreamAvailable") {
                    let remoteVideo =
                        <HTMLVideoElement>document.getElementById("remoteVideo");
                    remoteVideo.srcObject = obj.stream;
                }
            },
            callbackError: (err, message) => {
                console.log("There was an error: " + err);
                console.log("There was en error: " + message);
            }
        })
    }
}
