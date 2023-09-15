import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  NgbModule,
  NgbModalModule,
  NgbNavModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbAccordionModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';

import { AppComponent } from './app.component';
import { LoginComponent } from './shared/login/login.component';

import { CustomeTimePickerComponent } from './custome-time-picker/custome-time-picker.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Firebase
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { ProfileComponent } from './shared/profile/profile.component';
import { ChatuiComponent } from './shared/chatui/chatui.component';
import { ChatnotificationsComponent } from './shared/chatnotifications/chatnotifications.component';
import { CallnotificationsComponent } from './shared/callnotifications/callnotifications.component';
import { WalletComponent } from './shared/wallet/wallet.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ChatuiComponent,
    ChatnotificationsComponent,
    CallnotificationsComponent,
    WalletComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDatepickerModule,
    NgSelectModule,
    NgxIntlTelInputModule,
    NgOtpInputModule,
    AppRoutingModule,
    NgbTimepickerModule,
    CustomeTimePickerComponent,
    HttpClientModule,

    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFirestoreModule,

    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
