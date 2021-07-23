import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';
import { faReplyAll, faUserFriends, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Message } from '../../../../models/message.model';
import { ChatManagementService } from './state-management/chat-management.service';
import { Observable } from 'rxjs';
import { MessageScope } from '../../../../enums/message-scope';
import { ChatParticipantViewModel } from './state-management/view-models/chat-participant-viewmodel';
import { MessageViewModel } from './state-management/view-models/message-viemodel';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    constructor(private chatManagementService: ChatManagementService) { 
        this.clickCloseChatBar = new EventEmitter<void>();
        this.currentParticipants$ = this.chatManagementService.currentParticipants$;
        this.displayedMessages$ = this.chatManagementService.displayedMessages$;
        this.isUserSelectingParticipant$ = this.chatManagementService.isUserSelectingParticipant$;
        this.messageContentFormControl = this.chatManagementService.messageContentFormControl;
    }

    @Input() isChatBarOpen: boolean;

    @Output() clickCloseChatBar: EventEmitter<void>;

    public currentParticipants$: Observable<ChatParticipantViewModel[]>;
    public displayedMessages$: Observable<MessageViewModel[]>;
    public isUserSelectingParticipant$: Observable<boolean>;
    public messageContentFormControl: FormControl;

    public windowClose = faWindowClose;
    public replyAll = faReplyAll;
    public userFriends = faUserFriends;
    public sendMessageIcon = faPaperPlane;

    public ngOnInit() {
    }

    public onClickCloseChatBar() {
        this.clickCloseChatBar.emit();
    }

    public onClickGoToParticipantSelection() { 
        this.chatManagementService.goToParticipantSelection();
    }

    public onClickTalkToRoom() {
        this.chatManagementService.talkToRoom();
    }

    public onClickTalkToParticipant(participantName: string) {
        console.log(participantName);
        this.chatManagementService.talkToParticipant(participantName);
    }
    
    public async onClickSendMessage() {
        await this.chatManagementService.sendMessage();
    }
    
    public onScrollMessages($event: any) { 
        this.chatManagementService.stopScrollingChatBarToTheBottom();
    }
}
