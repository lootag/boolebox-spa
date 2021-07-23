export class ChatParticipant { 
    get name(): string { 
        return this._name;
    }

    private _name: string;

    constructor(name: string) { 
        this._name = name; 
    }
}
