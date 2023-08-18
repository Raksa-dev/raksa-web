import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import {
//   SearchCountryField,
//   CountryISO,
//   PhoneNumberFormat,
// } from 'ngx-intl-tel-input';

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
import { Observable, Subject, concat, of, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // public SearchCountryField = SearchCountryField;
  // public CountryISO = CountryISO;
  // public PhoneNumberFormat = PhoneNumberFormat;
  // public preferredCountries: CountryISO[] = [
  //   CountryISO.India,
  //   CountryISO.UnitedStates,
  // ];

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

  public signUpForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: [null, [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    birthTime: [null, [Validators.required]],
    birthPlace: ['', [Validators.required]],
    maritialStatus: [null, [Validators.required]],
    isAstrologer: [null, [Validators.required]],
  });
  public signUpFormSubmitted: boolean = false;

  public phoneForm!: FormGroup;
  public phoneSubmitted: boolean = false;

  public otpForm!: FormGroup;
  public otpSubmitted: boolean = false;

  public profileForm!: FormGroup;
  public profileSubmitted: boolean = false;

  public phoneNumber: string;

  options: any[] = [];

  movies$: Observable<any>;
  moviesLoading = false;
  moviesInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;

  trackByFn(item: any) {
    return item.imdbID;
  }

  loadMovies() {
    this.movies$ = // default items
      this.moviesInput$.pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => (this.moviesLoading = true)),
        switchMap((term) => {
          return this.getMovies(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.moviesLoading = false))
          );
        })
      );
  }

  getMovies(term: string = null): Observable<any> {
    const httpOptions = {
      headers: {
        'X-RapidAPI-Key': 'caeb00ca62msh82e7ceb1a80bcabp142705jsnc0b4069afb3e',
        'X-RapidAPI-Host': 'place-autocomplete1.p.rapidapi.com',
      },
      params: { input: term, radius: '500' },
    };
    return this.http
      .get<any>(
        `https://place-autocomplete1.p.rapidapi.com/autocomplete/json`,
        httpOptions
      )
      .pipe(
        map((resp) => {
          if (resp.Error) {
            throwError(resp.Error);
          } else {
            return resp.predictions;
          }
        })
      );
  }

  constructor(
    private auth: Auth,
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadMovies();
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

  search = (text$: any) => {
    console.log('this isn ciool');
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchText) => {
        console.log('this is serach text', searchText);
        const httpOptions = {
          headers: {
            'X-RapidAPI-Key':
              'caeb00ca62msh82e7ceb1a80bcabp142705jsnc0b4069afb3e',
            'X-RapidAPI-Host': 'place-autocomplete1.p.rapidapi.com',
          },
          params: { input: 'new', radius: '500' },
        };
        return this.http.get<any[]>(
          `https://place-autocomplete1.p.rapidapi.com/autocomplete/json`,
          httpOptions
        );
      }),
      tap((data) => {
        console.log('this is data in tap :', data);
        this.options = [data]; // Update options array with data from API response
      })
    );
  };

  searchMaster(text: string) {
    console.log('this is text :', text);
    this.options = ['nice'];
    return this.http.get<any[]>(`YOUR_API_URL?q=${text}`);
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

    signInWithPhoneNumber(this.auth, formValues['phoneNumber'], appVerifier)
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
    formValues['birthPlace'] = formValues['birthPlace'].description;

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
