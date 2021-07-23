import { Origin } from '../enums/origin';
import { ChatParticipant } from './chat-participant.model';
import { MessageScope } from '../enums/message-scope';

export class Message {
    constructor(content: string, 
                date: Date, 
                origin: Origin, 
                chatParticipant: ChatParticipant,
                scope: MessageScope,
                hasBeenRead: boolean) { 
        this._content = content;        
        this._date = date;
        this._origin = origin;
        this._chatParticipant = chatParticipant;
        this._scope = scope;
        this._hasBeenRead = hasBeenRead;
    }

    get content(): string { 
        return this._content;
    }

    get date(): Date { 
        return this._date;
    }

    get origin(): Origin { 
        return this._origin;
    }

    get chatParticipant(): ChatParticipant { 
        return this._chatParticipant;
    }

    get scope(): MessageScope { 
        return this._scope;
    }

    get hasBeenRead(): boolean { 
        return this._hasBeenRead;
    }

    private _content: string;
    private _date: Date;
    private _origin: Origin;
    private _chatParticipant: ChatParticipant;
    private _scope: MessageScope;
    private _hasBeenRead: boolean;

    public read(): Message {
       if(this._origin === Origin.RECEIVED) {
            return new Message(this._content, this._date, this._origin, this._chatParticipant, this._scope, true);
       }
       throw new Error('It is not possible to read a sent message');
    }
}
