import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Observable }   from 'rxjs';
import { ActivatedRoute } from '@angular/router'
import { SignalrConnectionManagementService } from './state-management/signalr/signalr-connection-management.service'
import { SignalRService } from '../../state-management/signalR/signal-r.service';
import { AuthService } from '../../state-management/auth/auth.service';
import { AntmediaManagementService } from './state-management/antmedia/antmedia-management.service'
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})

export class HomepageComponent implements OnInit, AfterViewInit {

    constructor(private signalRConnectionManagementService: SignalrConnectionManagementService,
                private authService: AuthService,
                private route      : ActivatedRoute,
                private antmediaManagementService: AntmediaManagementService,
                private signalRService: SignalRService) { 

        this.isPublishingAudio$ = this.antmediaManagementService.isPublishingAudio$;
        this.isPublishingVideo$ = this.antmediaManagementService.isPublishingVideo$;
        this.streams$ = this.antmediaManagementService.streams$;
        this.isChatBarOpen$ = this.signalRConnectionManagementService.isChatBarOpen$;
    }
    public  streams$: Observable<string[]>;
    public  isPublishingAudio$: Observable<boolean>;
    public  isPublishingVideo$: Observable<boolean>;
    public  isChatBarOpen$: Observable<boolean>;

    public async ngOnInit(): Promise<void> {
        this.antmediaManagementService.enterRoom();
    }

    public async ngAfterViewInit() {
        await this.signalRService.connect(this.authService.token, this.authService.room);
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
       $event.returnValue = true; 
    }

    public onClickMute() {
        this.antmediaManagementService.mute();
    }

    public onClickUnmute() {
        this.antmediaManagementService.unmute();
    }

    public onClickTurnVideoOff() {
        this.antmediaManagementService.turnVideoOff();
    }
    
    public onClickTurnVideoOn() {
        this.antmediaManagementService.turnVideoOn();
    }

    public onClickHangUp() {
        this.antmediaManagementService.hangUp();
    }

    public onClickOpenChatBar() {
        this.signalRConnectionManagementService.openChatBar();
    }

    public onClickCloseChatBar() {
        this.signalRConnectionManagementService.closeChatBar();
    }
}
