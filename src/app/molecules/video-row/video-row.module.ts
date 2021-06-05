import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoRowComponent } from './video-row/video-row.component';
import { VideoModule } from '../../atoms/video/video.module';
import { VideoComponent } from '../../atoms/video/video/video.component';



@NgModule({
  declarations: [VideoRowComponent],
  imports: [
    CommonModule,
    VideoModule,
  ],
  exports: [
    VideoRowComponent
  ]
})
export class VideoRowModule { }
