import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VideoBlockModule } from './organisms/video-block/video-block.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient }       from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SettingsComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    VideoBlockModule
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
