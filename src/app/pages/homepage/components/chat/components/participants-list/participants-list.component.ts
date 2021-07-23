import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatParticipantViewModel } from '../../state-management/view-models/chat-participant-viewmodel';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent {

    constructor() { 
        this.clickTalkToParticipant = new EventEmitter<string>();
    }

    @Input() currentParticipants: ChatParticipantViewModel[];

    @Output() clickTalkToParticipant: EventEmitter<string>;

    public onClickTalkToParticipant(participantName: string) { 
       this.clickTalkToParticipant.emit(participantName);
    }
}
