import { Component, Output, EventEmitter } from '@angular/core';
import { faReplyAll, faUserFriends, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-chat-controls',
  templateUrl: './chat-controls.component.html',
  styleUrls: ['./chat-controls.component.scss']
})
export class ChatControlsComponent {

    constructor() { 
        this.clickCloseChatBar = new EventEmitter<void>();
        this.clickGoToParticipantSelection = new EventEmitter<void>();
        this.clickTalkToRoom = new EventEmitter<void>();
        this.clickTalkToParticipant = new EventEmitter<string>();
    }

    @Output() clickCloseChatBar: EventEmitter<void>;
    @Output() clickGoToParticipantSelection: EventEmitter<void>;
    @Output() clickTalkToRoom: EventEmitter<void>;
    @Output() clickTalkToParticipant: EventEmitter<string>;

    public windowClose = faWindowClose;
    public replyAll = faReplyAll;
    public userFriends = faUserFriends;

    public onClickCloseChatBar() {
        this.clickCloseChatBar.emit();
    }

    public onClickGoToParticipantSelection() {
        this.clickGoToParticipantSelection.emit();
    }

    public onClickTalkToRoom() { 
        this.clickTalkToRoom.emit();
    }

    public onClickTalkToParticipant(participantName: string) {
       this.clickTalkToParticipant.emit(participantName);
    }
}
