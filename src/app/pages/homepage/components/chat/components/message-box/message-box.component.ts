import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent {

    constructor() { 
        this.clickSendMessage = new EventEmitter<void>();
    }

    @Input() messageContentFormControl: FormControl;

    @Output() clickSendMessage: EventEmitter<void>;


    public sendMessageIcon = faPaperPlane;
  
    public onClickSendMessage() {
        this.clickSendMessage.emit();
    }
}
