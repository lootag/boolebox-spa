import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MessageViewModel } from '../../state-management/view-models/message-viemodel';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent {

  constructor() { 
    this.scrollMessages = new EventEmitter<any>();
  }

  @Input() displayedMessages: MessageViewModel[];

  @Output() scrollMessages: EventEmitter<any>;

  public onScroll($event) { 
   this.scrollMessages.emit($event);
  }
}
