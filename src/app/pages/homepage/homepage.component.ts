import { Component, OnInit, HostListener } from '@angular/core';
import { Observable }   from 'rxjs';
import { ActivatedRoute } from '@angular/router'
import { SignalrConnectionManagementService } from './state-management/signalr/signalr-connection-management.service'
import { AntmediaManagementService } from './state-management/antmedia/antmedia-management.service'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})

export class HomepageComponent implements OnInit {

    constructor(private signalRConnectionManagementService: SignalrConnectionManagementService,
                private route      : ActivatedRoute,
                private antmediaManagementService: AntmediaManagementService) { 

        this.isPublishingAudio$ = this.antmediaManagementService.isPublishingAudio$;
        this.isPublishingVideo$ = this.antmediaManagementService.isPublishingVideo$;
        this.streams$ = this.antmediaManagementService.streams$;
    }
    public  streams$: Observable<string[]>;
    public  isPublishingAudio$: Observable<boolean>;
    public  isPublishingVideo$: Observable<boolean>;

    public async ngOnInit(): Promise<void> {
        await this.signalRConnectionManagementService.connect();
        this.antmediaManagementService.enterRoom();
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
       $event.returnValue = true; 
    }

    public onMute() {
        this.antmediaManagementService.mute();
    }

    public onUnmute() {
        this.antmediaManagementService.unmute();
    }

    public onTurnVideoOff() {
        this.antmediaManagementService.turnVideoOff();
    }
    
    public onTurnVideoOn() {
        this.antmediaManagementService.turnVideoOn();
    }

    public onHangUp() {
        this.antmediaManagementService.hangUp();
    }
}
