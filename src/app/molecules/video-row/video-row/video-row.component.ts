import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Stream } from '../../../models/stream.model';

@Component({
  selector: 'app-video-row',
  templateUrl: './video-row.component.html',
  styleUrls: ['./video-row.component.scss']
})
export class VideoRowComponent  {

  constructor() { }

  @Input() streams: Stream[];

}
