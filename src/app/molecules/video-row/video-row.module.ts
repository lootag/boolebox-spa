import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoRowComponent } from './video-row/video-row.component';
import { VideoModule } from '../../atoms/video/video.module';



@NgModule({
  declarations: [VideoRowComponent],
  imports: [
    CommonModule,
    VideoModule
  ]
})
export class VideoRowModule { }
