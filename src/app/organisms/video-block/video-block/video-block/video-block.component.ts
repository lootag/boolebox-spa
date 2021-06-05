import { Component, OnInit, Input } from '@angular/core';
import { Stream } from '../../../../models/stream.model';

@Component({
  selector: 'app-video-block',
  templateUrl: './video-block.component.html',
  styleUrls: ['./video-block.component.scss']
})
export class VideoBlockComponent implements OnInit {

  constructor() { }
  @Input() stream: Stream;
    
  ngOnInit(): void {
    let remoteVideoId = "remoteVideo" + this.stream.streamId;
    let remoteVideo = <HTMLVideoElement>document.getElementById(remoteVideoId);
    if (this.stream.streamSource != null) {
        remoteVideo.srcObject = this.stream.streamSource;
    }
  }
}
