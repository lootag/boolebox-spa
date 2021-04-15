import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent }    from './pages/homepage/homepage.component'
import { LoginComponent }       from './pages/login/login.component'

const routes: Routes = [
    { path: "main/:roomCode" , component: HomepageComponent },
    { path: "login", component: LoginComponent    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

