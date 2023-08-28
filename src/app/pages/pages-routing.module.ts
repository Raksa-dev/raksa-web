import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { CallComponent } from './call/call.component';
import { LiveComponent } from './live/live.component';
import { authGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'call',
    component: CallComponent,
  },
  {
    path: 'live',
    component: LiveComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [authGuard],
})
export class PagesRoutingModule {}
export const RoutingComponents = [
  HomeComponent,
  ChatComponent,
  CallComponent,
  LiveComponent,
];
