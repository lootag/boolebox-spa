import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Stream } from '../../../models/stream.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnChanges {

  constructor() { }


  @Input() stream: Stream;

  ngOnInit(): void {
    this.playStreamIfNotNull(this.stream.streamSource);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["stream"] && this.stream) {
        this.playStreamIfNotNull(this.stream.streamSource);
    }
  }

  private playStreamIfNotNull(stream: any): void {
    let remoteVideoId = "atomic-video";
    let remoteVideo = <HTMLVideoElement>document.getElementById(remoteVideoId);
    if (stream != null) {
        remoteVideo.srcObject = stream;
    }
  }

}
