import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient }       from '@angular/common/http';
import { SidebarModule } from 'ng-sidebar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './pages/homepage/components/navbar/navbar.component';
import { ChatComponent } from './pages/homepage/components/chat/chat.component';
import { ControlsComponent } from './pages/homepage/components/controls/controls.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessagesListComponent } from './pages/homepage/components/chat/components/messages-list/messages-list.component';
import { ParticipantsListComponent } from './pages/homepage/components/chat/components/participants-list/participants-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatControlsComponent } from './pages/homepage/components/chat/components/chat-controls/chat-controls.component';
import { MessageBoxComponent } from './pages/homepage/components/chat/components/message-box/message-box.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SettingsComponent,
    LoginComponent,
    NavbarComponent,
    ChatComponent,
    ControlsComponent,
    MessagesListComponent,
    ParticipantsListComponent,
    ChatControlsComponent,
    MessageBoxComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    SidebarModule.forRoot(),
    BrowserAnimationsModule,
    MatSidenavModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
