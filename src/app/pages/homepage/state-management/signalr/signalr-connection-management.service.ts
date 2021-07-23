import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from "@aspnet/signalr";
import { Observable, BehaviorSubject } from 'rxjs';
import { Message } from '../../../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrConnectionManagementService {

    constructor() { 

        this._isChatBarOpen$ = new BehaviorSubject<boolean>(false);
        this._messages$ = new BehaviorSubject<Map<string, Message[]>>(new Map<string, Message[]>());
        this._arePublicMessagesDisplayed$ = new BehaviorSubject<boolean>(true);
        this._selectedUser$ = new BehaviorSubject<string>(null);
    }
    

    get isChatBarOpen$(): Observable<boolean> { 
        return this._isChatBarOpen$.asObservable();
    }

    private connection: signalR.HubConnection;
    private _isChatBarOpen$: BehaviorSubject<boolean>;
    private _messages$: BehaviorSubject<Map<string, Message[]>>;
    private _displayedMessages$: BehaviorSubject<Map<string, Message[]>>;
    private _arePublicMessagesDisplayed$: BehaviorSubject<boolean>;
    private _selectedUser$: BehaviorSubject<string>;

    public openChatBar() {
        this._isChatBarOpen$.next(true);
    }

    public closeChatBar() {
        this._isChatBarOpen$.next(false);
    }

}
