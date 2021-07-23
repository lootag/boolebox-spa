import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhoneSlash, faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

    constructor() { 
        this.clickMute = new EventEmitter<void>();
        this.clickUnmute = new EventEmitter<void>();
        this.clickTurnVideoOff = new EventEmitter<void>();
        this.clickTurnVideoOn = new EventEmitter<void>();
        this.clickHangUp = new EventEmitter<void>();
    }

    @Input() isPublishingAudio: boolean;
    @Input() isPublishingVideo: boolean;

    @Output() clickMute: EventEmitter<void>;
    @Output() clickUnmute: EventEmitter<void>;
    @Output() clickTurnVideoOff: EventEmitter<void>;
    @Output() clickTurnVideoOn: EventEmitter<void>;
    @Output() clickHangUp: EventEmitter<void>;

    public  videoIcon = faVideo;
    public  videoSlashIcon = faVideoSlash;
    public  micIcon = faMicrophone;
    public  micSlashIcon = faMicrophoneSlash;
    public  phoneSlashIcon = faPhoneSlash;

    public onClickMute() {
        this.clickMute.emit();
    }

    public onClickUnmute() { 
        this.clickUnmute.emit();
    }

    public onClickTurnVideoOff() { 
        this.clickTurnVideoOff.emit();
    }

    public onClickTurnVideoOn() { 
        this.clickTurnVideoOn.emit();
    }

    public onClickHangUp() { 
        this.clickHangUp.emit();
    }
}
