import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { CallComponent } from './call/call.component';
import { LiveComponent } from './live/live.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from '../auth/auth.guard';
import { AboutousComponent } from './aboutous/aboutous.component';
import { ContactousComponent } from './contactous/contactous.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { TransactionComponent } from './transaction/transaction.component';

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
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: 'about-ous',
    component: AboutousComponent,
  },
  {
    path: 'contact-ous',
    component: ContactousComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacypolicyComponent,
  },
  {
    path: 'terms-and-conditions',
    component: TermsandconditionsComponent,
  },
  {
    path: 'transaction',
    component: TransactionComponent,
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
