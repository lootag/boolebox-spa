import { Message } from '../../../../../../models/message.model';
import { Origin } from '../../../../../../enums/origin';

export class MessageViewModel { 
    content: string;
    date: string;
    origin: string;
    chatParticipant: string;

    constructor(message: Message) { 
        this.content = message.content;
        this.date = message.date.toDateString();
        this.origin = Origin[message.origin].toUpperCase();
        this.chatParticipant = (message.chatParticipant) ? message.chatParticipant.name : null;
    }
}
