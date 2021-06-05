import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoBlockComponent } from './video-block/video-block/video-block.component';
import { VideoRowModule } from '../../molecules/video-row/video-row.module';



@NgModule({
  declarations: [VideoBlockComponent],
  imports: [
    CommonModule,
    VideoRowModule
  ],
  exports: [
    VideoBlockComponent
  ]
})
export class VideoBlockModule { }
