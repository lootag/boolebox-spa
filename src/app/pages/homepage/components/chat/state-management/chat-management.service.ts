import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageScope } from '../../../../../enums/message-scope';
import { Origin } from '../../../../../enums/origin';
import { Message } from '../../../../../models/message.model';
import { ChatParticipant } from '../../../../../models/chat-participant.model';
import { withLatestFrom, map, combineLatest } from 'rxjs/operators';
import { ChatParticipantViewModel } from './view-models/chat-participant-viewmodel';
import { MessageViewModel } from './view-models/message-viemodel';
import * as signalR from "@aspnet/signalr";
import { SignalRService } from '../../../../../state-management/signalR/signal-r.service';
import { AuthService } from '../../../../../state-management/auth/auth.service';
import { distinct } from './helpers';
import { FormControl } from '@angular/forms';
import { element } from 'protractor';
import { scrollChatBarToTheBottom } from './helpers';

@Injectable({
  providedIn: 'root'
})
export class ChatManagementService {

    constructor(private signalRService: SignalRService,
                private authService: AuthService) {
        this._currentMessages$ = new BehaviorSubject<Message[]>([]);
        this._selectedScope$ = new BehaviorSubject<MessageScope>(MessageScope.PUBLIC);
        this._currentParticipants$ = new BehaviorSubject<ChatParticipant[]>([]);
        this._selectedParticipant$ = new BehaviorSubject<ChatParticipant>(undefined);
        this._isUserSelectingPariticpant$ = new BehaviorSubject<boolean>(false);
        if(!this.signalRService.connection) this.signalRService.buildConnection(this.authService.token);

        this.signalRService.connection.on("ReceiveMessage", (messageContent: string, participantName: string, scope: string) => {
            if(participantName != this.authService.userIdentifier) {
                const participant = new ChatParticipant(participantName);

                const message = new Message(messageContent, 
                                            new Date(Date.now()),
                                            Origin.RECEIVED, 
                                            participant,
                                            MessageScope[scope.toUpperCase()],
                                            false)

                clearInterval(this.scrollTimerId);
                this.scrollTimerId = setInterval(scrollChatBarToTheBottom, 300);
                const updatedMessages = this._currentMessages$.value.concat(message);
                this._currentMessages$.next(updatedMessages);
            }
        });

        this.signalRService.connection.on("ReceiveOnlineParticipants", (participantNames: string[]) => {
            let participants = participantNames
                                    .filter(p => p != this.authService.userIdentifier)
                                    .map(p => new ChatParticipant(p));
            this._currentParticipants$.next(participants);
        });
    }

    public messageContentFormControl: FormControl = new FormControl('');

    get displayedMessages$(): Observable<MessageViewModel[]> {
        return this._currentMessages$.pipe(
            combineLatest(this._selectedScope$),
            map(([messages, scope]) => {
                const vieModelsInScope = messages.filter(m => m.scope === scope);
                return vieModelsInScope;
            })
        ).pipe(
            combineLatest(this._selectedParticipant$),
            map(([messages, participant]) => {
                const viewModelsForParticipant = this.getMessageViewModels(messages, participant);
                return viewModelsForParticipant;
            })
        );
    }

    get isUserSelectingParticipant$(): Observable<boolean> { 
        return this._isUserSelectingPariticpant$.asObservable();
    }

    get currentParticipants$(): Observable<ChatParticipantViewModel[]> { 
        return this._currentParticipants$.pipe(
            combineLatest(this._currentMessages$),
            map(([participants, messages]) => {
                const viewModels = (messages.length != 0) ? this.getChatParticipantViewModels(participants, messages)
                               : participants.map(p => {
                                let viewModel: ChatParticipantViewModel = {name: p.name, hasUnreadMessages: false};
                                return viewModel;
                });
                console.log("here's the participants", viewModels);
                return viewModels
            })
        );
    }

    private _selectedScope$: BehaviorSubject<MessageScope>;
    private _currentParticipants$: BehaviorSubject<ChatParticipant[]> = new BehaviorSubject<ChatParticipant[]>([]);
    private _currentMessages$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([])
    private _selectedParticipant$: BehaviorSubject<ChatParticipant>;
    private _isUserSelectingPariticpant$: BehaviorSubject<boolean>;
    private signalRConnection: signalR.HubConnection;
    private scrollTimerId: any = 1000;

    public async sendMessage() { 
        const messageContent = this.messageContentFormControl.value as string;
        const participant = (this._selectedParticipant$.value) ? this._selectedParticipant$.value : new ChatParticipant("room");
        let message = new Message(messageContent, new Date(Date.now()), Origin.SENT, participant, this._selectedScope$.value, undefined);
        await this.sendMessageToSignalR(messageContent);
        let updatedMessages = this._currentMessages$.value.concat(message);
        this._currentMessages$.next(updatedMessages);
        this.messageContentFormControl.setValue('');
        if(!this._isUserSelectingPariticpant$.value) {
            clearInterval(this.scrollTimerId);
            this.scrollTimerId = setInterval(scrollChatBarToTheBottom, 300);
        }
    }

    public talkToRoom() { 
        this._isUserSelectingPariticpant$.next(false);
        this._selectedScope$.next(MessageScope.PUBLIC);
        this._selectedParticipant$.next(undefined);
    }

    public goToParticipantSelection() { 
        this._isUserSelectingPariticpant$.next(true);
    }

    public talkToParticipant(name: string) {
        const participant = new ChatParticipant(name);
        this._selectedParticipant$.next(participant);
        this._isUserSelectingPariticpant$.next(false);
        this._selectedScope$.next(MessageScope.PRIVATE);
        const currentMessages = this._currentMessages$.value;
        const updatedMessages = currentMessages.map(m => {
          return (m.chatParticipant.name === name) ? m.read() : m;
        });
        this._currentMessages$.next(updatedMessages);
    }

    public stopScrollingChatBarToTheBottom() {
        console.log("interval before getting cleared is", this.scrollTimerId);
        clearInterval(this.scrollTimerId);
    }

    private getChatParticipantViewModels(participants: ChatParticipant[], messages: Message[]) { 
        const participantsWithUnreadMessages = this.getParticipantsWithUnreadMessages(messages);
        const participantsWithNoUnreadMessages = participants
                                                        .filter(p => p.name != "")
                                                        .filter(p => !participantsWithUnreadMessages.includes(p))
        const participantsWithUnreadMessagesViewModels = participantsWithUnreadMessages
                                                        .map(p => {
                                                                const viewModel: ChatParticipantViewModel= {name: p.name, hasUnreadMessages: true}
                                                                return viewModel;
                                                        });

        const participantsWithNoUnreadMessagesViewModels = participantsWithNoUnreadMessages
                                                            .map(p => {
                                                                const viewModel: ChatParticipantViewModel = {name: p.name, hasUnreadMessages: false}
                                                                return viewModel;
                                                            });
        return participantsWithUnreadMessagesViewModels.concat(participantsWithNoUnreadMessagesViewModels);
    }

    private getMessageViewModels(messages: Message[], participant: ChatParticipant): MessageViewModel[] { 
                if(participant) return messages
                                        .filter(m => m.chatParticipant.name == participant.name)
                                        .map(m => new MessageViewModel(m));
                return messages.map(m => new MessageViewModel(m));
    }

    private getParticipantsWithUnreadMessages(messages: Message[]): ChatParticipant[] { 
               const participantNamesWithUnreadMessages = messages.filter(m => m.origin === Origin.RECEIVED)
                                                                  .filter(m => !m.hasBeenRead)
                                                                  .map(m => m.chatParticipant)
                                                                  .map(m => m.name)
                                                                  .filter((item, index, array) => array.indexOf(item) === index);
               console.log("here's the participants with unread messages", participantNamesWithUnreadMessages);
               return participantNamesWithUnreadMessages.map(n => new ChatParticipant(name))
    }

    private async sendMessageToSignalR(messageContent: string) { 
        if(this._selectedScope$.value === MessageScope.PRIVATE) {
            console.log("sending message to user")
            await this.signalRService.connection.invoke("SendMessageToUser", this._selectedParticipant$.value.name, messageContent);
        } else {
            await this.signalRService.connection.invoke("SendMessageToRoom", this.authService.room, messageContent)
        }
    }

}
