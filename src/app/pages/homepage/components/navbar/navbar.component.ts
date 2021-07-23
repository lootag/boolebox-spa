import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    constructor() { 
        this.clickOpenChatBar = new EventEmitter<void>();
    }

    @Output() clickOpenChatBar: EventEmitter<void>;

    public chatIcon = faComments;

    onClickOpenChatBar() {
        this.clickOpenChatBar.emit();
    }
}
