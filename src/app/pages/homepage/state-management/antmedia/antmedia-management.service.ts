import { Injectable } from '@angular/core';
import { WebRTCAdaptor } from '../../../../../assets/js/webrtc-adaptor.js';
import { Stream } from '../../../../models/stream.model';
import { pcConfig, sdpConstrains, mediaConstraints, localVideoId, websocketUrl, debug, bandwidth} from '../../constants';
import { Observable, BehaviorSubject } from 'rxjs'
import { AuthService }       from '../../../../state-management/auth/auth.service';
import { SignalRService } from '../../../../state-management/signalR/signal-r.service';
import { ChatParticipant } from '../../../../models/chat-participant.model';

@Injectable({
  providedIn: 'root'
})

export class AntmediaManagementService {

    constructor(private authService: AuthService,
                private signalRService: SignalRService) { 
        if(!this.signalRService.connection) this.signalRService.buildConnection(this.authService.token);
        this.signalRService.connection.on("SetParticipantSharingScreen", this.setParticipantSharingScreen);
    }

    get isPublishingAudio$(): Observable<boolean> {
        return this._isPublishingAudio$.asObservable();
    }

    get isPublishingVideo$(): Observable<boolean> {
        return this._isPublishingVideo$.asObservable();
    }

    get streams$(): Observable<string[]> {
        return this._streams$.asObservable();
    }

    private webRTCAdaptor: WebRTCAdaptor;
    private roomTimerId: NodeJS.Timeout;
    private _streams$ : BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private _isPublishingAudio$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _isPublishingVideo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _participantSharingScreen$: BehaviorSubject<ChatParticipant> = new BehaviorSubject<ChatParticipant>(undefined);

    public enterRoom(): void {
        this.webRTCAdaptor = new WebRTCAdaptor({
            websocket_url : websocketUrl,
            mediaConstraints: mediaConstraints,
            peerconnection_config: pcConfig,
            sdp_constraints: sdpConstrains,
            localVideoId: localVideoId,
            debug: debug,
            bandwidth: bandwidth,
            callback: (info, obj) => {
                this.dispatchCallback(info, obj);
            },
            callbackError: (err, message) => {
                console.log("There was an error: " + err);
                console.log("There was en error: " + message);
            }
        })
        this.resetLocalVideoShape();
    }

    public hangUp(): void {
        this.webRTCAdaptor.leaveFromRoom("someRoom");
        clearInterval(this.roomTimerId);
        this._streams$.next([]);
        this.resetLocalVideoShape();
    }

    public mute(): void {
        this.webRTCAdaptor.muteLocalMic();
        this._isPublishingAudio$.next(false);
    }

    public unmute(): void {
        this.webRTCAdaptor.unmuteLocalMic();
        this._isPublishingAudio$.next(true);
    }

    public turnVideoOff(): void {
        this.webRTCAdaptor.turnOffLocalCamera();
        this._isPublishingVideo$.next(false);
    }

    public turnVideoOn(): void {
        this.webRTCAdaptor.turnOnLocalCamera();
        this._isPublishingVideo$.next(true);
    }

    private dispatchCallback(info: string, obj: any): void{
        if (info === "initialized") {
            return this.joinRoom(obj);
        } 
        else if (info === "joinedTheRoom") {
            return this.playExistingStreamsAndPingRoomInfo(obj);
        }
        else if (info === "roomInformation") {
            return this.playNewStreams(obj);
        }
        else if (info === "newStreamAvailable") {
            return this.addVideoSource(obj);
        }
        else if (info == "play_finished") {
            return this.removeVideoSource(obj);
        }
    }

        
    private joinRoom(obj: any) {
        const localVideoId = "localVideo";
        (<HTMLVideoElement>document.getElementById(localVideoId)).muted = true;
        this.webRTCAdaptor.joinRoom("someRoom", this.authService.userIdentifier);	
    }

    private playExistingStreamsAndPingRoomInfo(obj: any) {
        const getRoomInfoIntervalMs = 3000;
        this.webRTCAdaptor.publish(obj.streamId, null);
        if (obj.streams) {
            obj.streams.forEach(s => {
                let streams = this._streams$.value;
                streams.push(s);
                this._streams$.next(streams);
                this.webRTCAdaptor.play(s);
            })
        }

        this.roomTimerId = setInterval(() => {
        this.webRTCAdaptor.getRoomInfo("someRoom",
                                        this.authService.userIdentifier);
        }, getRoomInfoIntervalMs)
    }

    private playNewStreams(obj: any) {
        if (obj.streams.length != 0) {
            let streams = this._streams$.value;
            obj.streams.forEach(s => {
                if (!streams.includes(s)) {
                    streams.push(s);
                    this.webRTCAdaptor.play(s);
                }
            });
            this._streams$.next(streams);
        }
    }

    private addVideoSource(obj: any) {
        this.reshapeVideoTags(false)
        let remoteVideoId = "remoteVideo-" + obj.streamId;
        let newRemoteVideo = <HTMLVideoElement>document.getElementById(remoteVideoId);
        if (obj.stream != null) {
            newRemoteVideo.srcObject = obj.stream;
        }
    }

    private removeVideoSource(obj: any) {
        let streams = this._streams$.value;
        let indexToRemove = streams.indexOf(obj.streamId);
        streams.splice(indexToRemove, 1);
        this._streams$.next(streams);
        this.reshapeVideoTags(true)
    }

    private reshapeVideoTags(videoRemoved: boolean): void {
        let remoteVideos = Array.from(document.getElementsByClassName("remote-video") as HTMLCollectionOf<HTMLElement>)
        let lastVideoIndex = remoteVideos.length - 1;
        if (videoRemoved) remoteVideos.splice(lastVideoIndex, 1);
        this.reshapeLocalVideo(remoteVideos.length);
        this.reshapeRemoteVideos(remoteVideos);
    }

    private reshapeRemoteVideos(remoteVideos: HTMLElement[]) {
        let remoteVideoWidths = this.computeRemoteVideoWidths()
        let remoteVideoHeights = this.computeRemoteVideoHeights()
        for(var index = 0; index < remoteVideos.length; index++) {
            remoteVideos[index].style.width = remoteVideoWidths[index]
            remoteVideos[index].style.height = remoteVideoHeights[index]
            this.redefineVideoTagsPositionsWhenThreeRemoteVideos(index, remoteVideos)
        }
    }

    private reshapeLocalVideo(numberOfRemoteVideos: number) {
        if (numberOfRemoteVideos > 0) {
            this.moveLocalVideoToBottomRight();
        }
        else {
            this.resetLocalVideoShape();
        }
    }

    private moveLocalVideoToBottomRight() {
        let localVideo = document.getElementById("localVideo");
        localVideo.style.width = "10%";
        localVideo.style.height = "10%";
        localVideo.style.position = "absolute";
        localVideo.style.right = "0%";
        localVideo.style.bottom = "0%";
        this.setLocalVideoDraggability(true);
    }

    private resetLocalVideoShape() {
        let localVideo = document.getElementById("localVideo");
        let windowHeight = window.innerHeight * 0.8;
        localVideo.style.width = "100%";
        localVideo.style.height = windowHeight.toString() + "px";
        localVideo.style.position = "";
        localVideo.style.right = "";
        localVideo.style.bottom = "";
        this.setLocalVideoDraggability(false);
    }

    private redefineVideoTagsPositionsWhenThreeRemoteVideos(videoTagNumber: number,
                                       remoteVideos: HTMLElement[]): void {
        if (videoTagNumber === 2 && remoteVideos.length === 3) {
            remoteVideos[1].style.position = "absolute";
            remoteVideos[1].style.top = remoteVideos[0].style.top;
            remoteVideos[1].style.right = "0%";
        } else if (remoteVideos.length > 3){
            remoteVideos[1].style.position = "";
            remoteVideos[1].style.top = "";
            remoteVideos[1].style.right = "";
        }
    }

    private redefineVideoTagsPositionsWhenFourOrFiveOrSixRemoteVideos(videoTagNumber: number,
                                                           remoteVideos: HTMLElement[]) {
        if (remoteVideos.length === 4 || remoteVideos.length === 5) {
           for(var remoteVideoIndex = 2; remoteVideos.length; remoteVideoIndex++) {
                remoteVideos[remoteVideoIndex].style.display = "block";
            }
        }
    }

    private computeRemoteVideoHeights(): Array<string> {
        let numberOfVideos = this._streams$.value.length
        let windowHeight = window.innerHeight * 0.8
        if(numberOfVideos === 1 || numberOfVideos === 2) return Array(numberOfVideos).fill(windowHeight.toString() + "px")
        if(numberOfVideos === 3) return [windowHeight.toString() + "px", (windowHeight/2).toString() + "px", (windowHeight/2).toString() + "px"]
        if(numberOfVideos === 4 || numberOfVideos === 5 || numberOfVideos === 6) return Array(numberOfVideos).fill((windowHeight/2).toString() + "px")
        if(numberOfVideos === 7) return Array(4).fill((windowHeight/2).toString() + "px").concat(Array(3).fill((windowHeight/3).toString() + "px"))
        if(numberOfVideos === 8) return Array(2).fill((windowHeight/2).toString() + "px").concat(Array(6).fill((windowHeight/3).toString() + "px"))
        if(numberOfVideos === 9) return Array(numberOfVideos).fill((windowHeight/2).toString() + "px")
    }

    private computeRemoteVideoWidths(): Array<string> {
        let numberOfVideos = this._streams$.value.length
        if(numberOfVideos === 1) return Array(numberOfVideos).fill("100%")
        if(numberOfVideos === 2 || numberOfVideos === 3 || numberOfVideos === 4) return Array(numberOfVideos).fill("50%")
        if(numberOfVideos === 5) return Array(3).fill("33%").concat(Array(2).fill("50%"))
        if(numberOfVideos >= 6) return Array(numberOfVideos).fill("33%")
    }

    private setLocalVideoDraggability(isLocalVideoDraggable: boolean) {
        let localVideo = document.getElementById("localVideo");
        localVideo.style.cursor = isLocalVideoDraggable ? "move" : "";
    }

    private setParticipantSharingScreen() { 

    }

}
