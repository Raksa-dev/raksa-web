import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomeTimePickerComponent } from '../../custome-time-picker/custome-time-picker.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SearchCountryField,
  CountryISO,
  PhoneNumberFormat,
} from 'ngx-intl-tel-input';

import { NgOtpInputConfig } from 'ng-otp-input';
import {
  AuthService,
  UserService,
  WindowRefService,
} from 'src/app/core/services';

// Firebase
import {
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAdditionalUserInfo,
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public PhoneNumberFormat = PhoneNumberFormat;
  public preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedStates,
  ];

  public otpInputConfig: NgOtpInputConfig = {
    length: 6,
    allowNumbersOnly: true,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputClass: 'form-control',
  };

  // Firebase
  public windowRef: any;
  public formStep: number = 1;
  public loading: boolean = false;

  public signUpForm!: FormGroup;
  public signUpFormSubmitted: boolean = false;

  public phoneForm!: FormGroup;
  public phoneSubmitted: boolean = false;

  public otpForm!: FormGroup;
  public otpSubmitted: boolean = false;

  public profileForm!: FormGroup;
  public profileSubmitted: boolean = false;

  public phoneNumber: string;

  constructor(
    private auth: Auth,
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      birthTime: [null, [Validators.required]],
      birthPlace: ['', [Validators.required]],
      maritialStatus: [null, [Validators.required]],
      isAstrologer: [null, [Validators.required]],
    });

    this.phoneForm = this.formBuilder.group({
      phoneNumber: [null, [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    });

    this.otpForm = this.formBuilder.group({
      verificationCode: [null, [Validators.required, Validators.minLength(6)]],
    });

    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
    });
  }

  get phoneFrm() {
    return this.phoneForm.controls;
  }
  get otpFrm() {
    return this.otpForm.controls;
  }
  get profileFrm() {
    return this.profileForm.controls;
  }
  get signUpFrm() {
    return this.signUpForm.controls;
  }

  sendLoginCode(): void {
    this.phoneSubmitted = true;

    if (this.phoneForm.invalid) {
      return;
    }

    this.loading = true;

    this.windowRef = this.windowRefService.nativeWindow;
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
      },
      this.auth
    );

    let formValues = this.phoneForm.value;
    const appVerifier = this.windowRef.recaptchaVerifier;

    signInWithPhoneNumber(
      this.auth,
      formValues['phoneNumber'].e164Number,
      appVerifier
    )
      .then((result: any) => {
        this.windowRef.confirmationResult = result;

        this.phoneNumber = '094045 40805'
          .replace(/\s/g, '')
          .substring(1)
          .replace(
            /(\+?\d{2})(\d+)(\d{2})/g,
            function (match, start, middle, end) {
              return (
                formValues['phoneNumber'].dialCode +
                ' ' +
                start +
                '*'.repeat(middle.length) +
                end
              );
            }
          );

        this.loading = false;
        this.formStep = 2;
      })
      .catch((error: any) => {
        console.log('this is error sign in with phone number:', error);

        this.loading = false;
        console.log(error);
      });
  }

  // not using
  submitSignUp(): void {
    this.signUpFormSubmitted = true;
    if (this.signUpForm.invalid) {
      return;
    }

    let formValues = this.signUpForm.value;
  }

  verifyLoginCode(): void {
    console.log('this is triggered');

    this.otpSubmitted = true;

    if (this.otpForm.invalid) {
      return;
    }

    let formValues = this.otpForm.value;

    this.windowRef.confirmationResult
      .confirm(formValues['verificationCode'])
      .then((user: any) => {
        const isFirstLogin = getAdditionalUserInfo(user)?.isNewUser;
        if (isFirstLogin) {
          this.formStep = 3;
        } else {
          this.activeModal.close({ response: true });
        }
        this.loading = false;
      })
      .catch((error: any) => {
        this.otpFrm['verificationCode'].setErrors({ incorrect: true });
      });
  }

  createProfileInRegistration(): void {
    this.signUpFormSubmitted = true;
    if (this.signUpForm.invalid) {
      return;
    }

    let formValues = this.signUpForm.value;

    formValues['uid'] = this.authService.activeUserValue['uid'];
    formValues['dateOfBirth'] = new Date(
      formValues['dateOfBirth'].year,
      formValues['dateOfBirth'].month - 1,
      formValues['dateOfBirth'].day
    );
    formValues['isAstrologer'] =
      formValues['isAstrologer'] == 'true' ? true : false;


    this.userService
      .CreateUser(formValues)
      .then((data) => {
        this.activeModal.close({ response: true });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  createProfile(): void {
    this.profileSubmitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    let formValues = this.profileForm.value;

    formValues['uid'] = this.authService.activeUserValue['uid'];
    formValues['dateOfBirth'] = new Date(
      formValues['dateOfBirth'].year,
      formValues['dateOfBirth'].month - 1,
      formValues['dateOfBirth'].day
    );
    console.log(
      'this is user console logs :',
      this.authService.activeUserValue
    );

    this.userService
      .CreateUser(formValues)
      .then((data) => {
        console.log('this is data:,', data);
        this.activeModal.close({ response: true });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
