import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

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
import { Observable, Subject, concat, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private readonly storage: Storage = inject(Storage);

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

  linkCode: string = '';

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

  public relativeForm: FormGroup = this.formBuilder.group({
    relation: [null, [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: [null, [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    birthTime: [null, [Validators.required]],
    birthPlace: ['', [Validators.required]],
    maritialStatus: [null, [Validators.required]],
  });

  public personalForm: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    gender: [null, [Validators.required]],
    dateOfBirth: [null, [Validators.required]],
    age: [null, [Validators.required]],
    aadharNumber: [null, [Validators.required]],
    uploadedImage: [null, [Validators.required]],
  });

  public professionalForm: FormGroup = this.formBuilder.group({
    specialties: [null, [Validators.required]],
    yearsOfExperience: [null, [Validators.required]],
    callChargePerMinute: [null, [Validators.required]],
    chatChargePerMinute: [null, [Validators.required]],
    bio: ['', [Validators.required]],
    languages: [null, [Validators.required]],
  });

  public bankDetailsForm: FormGroup = this.formBuilder.group({
    accountName: [null, [Validators.required]],
    bank: [null, [Validators.required]],
    accountNumber: [null, [Validators.required]],
    ifscCode: [null, [Validators.required]],
    upiId: [''],
  });

  public relativeSubmitted: boolean = false;
  private relativeData: any = {};

  public phoneForm!: FormGroup;
  public phoneSubmitted: boolean = false;

  public otpForm!: FormGroup;
  public otpSubmitted: boolean = false;

  public profileForm!: FormGroup;
  public profileSubmitted: boolean = false;

  public phoneNumber: string;

  public addedMembers: number = 0;

  public uploadProgress = 0;

  options: any[] = [];

  public currentUser = this.userService.getUserData;

  movies$: Observable<any>;
  moviesLoading = false;
  moviesInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;

  specialtiesOptions = [
    'Vedic',
    'Numerology',
    'Face Reading',
    'Vaastu',
    'Meditation',
    'Match Making',
    'Career',
    'Legal',
  ];

  languagesOptions = ['English', 'Hindi', 'Telgu'];

  constructor(
    private auth: Auth,
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (
        params['code'] &&
        params['code'].length == 6 &&
        this.authService.activeUserValue
      ) {
        // this is astrologer
        this.formStep = 8;
        this.linkCode = params['code'];
      } else {
        // this is for user
        this.formStep = 1;
      }
    });
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
    localStorage.removeItem('user-sign-up-data');
  }

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

  get relativeFrm() {
    return this.relativeForm.controls;
  }

  search = (text$: any) => {
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
        this.loading = false;
        console.log(error);
      });
  }

  verifyLoginCode(): void {
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
          this.activatedRoute.queryParams.subscribe((params) => {
            if (params['code'] && params['code'].length == 6) {
              // this is astrologer
              this.formStep = 8;
            } else {
              // this is for user
              this.formStep = 3;
            }
          });
        } else {
          // if user is logined and check the User Collection Data  then show the creation forms
          this.userService
            .getDataFromUserCollection(user?.user?.uid)
            .then((data) => {
              if (Object.keys(data).length <= 1 || !data) {
                this.activatedRoute.queryParams.subscribe((params) => {
                  if (params['code'] && params['code'].length == 6) {
                    // this is astrologer
                    this.formStep = 8;
                  } else {
                    // this is for user
                    this.formStep = 3;
                  }
                });
              } else {
                this.activeModal.close({ response: true });
              }
            });
        }
        this.loading = false;
      })
      .catch((error: any) => {
        this.otpFrm['verificationCode'].setErrors({ incorrect: true });
      });
  }

  showAddMembersForm(): void {
    this.formStep = 4;
    localStorage.setItem(
      'user-sign-up-data',
      JSON.stringify(this.signUpForm?.value)
    );
  }
  goBackToSignUp(): void {
    let data = JSON.parse(localStorage.getItem('user-sign-up-data')!);
    this.signUpForm.patchValue(data);
    this.formStep = 3;
    this.relativeForm.reset();
  }

  submitRelativeForm(): void {
    this.relativeSubmitted = true;
    if (this.relativeForm.invalid) {
      return;
    }
    let formValues = this.relativeForm.value;

    formValues['dateOfBirth'] = new Date(
      formValues['dateOfBirth'].year,
      formValues['dateOfBirth'].month - 1,
      formValues['dateOfBirth'].day
    );
    formValues['birthPlace'] = formValues['birthPlace'].description;
    // format birthtime
    const hour = formValues['birthTime']?.hour?.toString().padStart(2, '0');
    const minute = formValues['birthTime']?.minute?.toString().padStart(2, '0');
    const second = formValues['birthTime']?.second?.toString().padStart(2, '0');
    const formattedTime = `${hour}:${minute}:${second} ${
      formValues['birthTime']?.hour >= 12 ? 'PM' : 'AM'
    }`;
    //////////////////
    formValues['birthTime'] = formattedTime;

    let relativeDataArray =
      JSON.parse(localStorage.getItem('relative-data')!) || [];

    if (relativeDataArray.length) {
      relativeDataArray.push(formValues);
    } else {
      relativeDataArray = [formValues];
    }
    this.addedMembers = relativeDataArray.length;
    localStorage.setItem('relative-data', JSON.stringify(relativeDataArray));
    this.formStep = 3;
    this.relativeSubmitted = false;
    let data = JSON.parse(localStorage.getItem('user-sign-up-data')!);
    this.signUpForm.patchValue(data);
    this.relativeForm.reset();

    // console.log('these are valuesin relatinve form:::::', formValues);

    // formValues['uid'] = this.authService.activeUserValue['uid'];
    // formValues['dateOfBirth'] = new Date(
    //   formValues['dateOfBirth'].year,
    //   formValues['dateOfBirth'].month - 1,
    //   formValues['dateOfBirth'].day
    // );
    // formValues['isAstrologer'] =
    //   formValues['isAstrologer'] == 'true' ? true : false;
    // formValues['birthPlace'] = formValues['birthPlace'].description;

    // this.userService
    //   .CreateUser(formValues)
    //   .then((data) => {
    //     this.activeModal.close({ response: true });
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
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
    // format birthtime
    const hour = formValues['birthTime']?.hour?.toString().padStart(2, '0');
    const minute = formValues['birthTime']?.minute?.toString().padStart(2, '0');
    const second = formValues['birthTime']?.second?.toString().padStart(2, '0');
    const formattedTime = `${hour}:${minute}:${second} ${
      formValues['birthTime']?.hour >= 12 ? 'PM' : 'AM'
    }`;
    //////////////////
    formValues['birthTime'] = formattedTime;
    let relativeDataArray =
      JSON.parse(localStorage.getItem('relative-data')!) || [];

    if (relativeDataArray.length) {
      formValues['relatives'] = relativeDataArray;
    }
    this.userService
      .CreateUser(formValues)
      .then((data) => {
        localStorage.removeItem('user-sign-up-data');
        this.userService.fetchUserData(this.authService.activeUserValue['uid']);
        this.activeModal.close({ response: true });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  submitAstrologerPersonalForm(): void {
    let formValues = this.personalForm.value;
    this.formStep = 9;
    localStorage.setItem(
      'astrologer-personal-form',
      JSON.stringify(formValues)
    );
    this.uploadProgress = 0;
  }
  submitAstrologerProfessionalForm(): void {
    let formValues = this.professionalForm.value;
    this.formStep = 10;
    localStorage.setItem(
      'astrologer-professioal-form',
      JSON.stringify(formValues)
    );
    // this.formStep = 10;
    // localStorage.setItem(
    //   'astrologer-professional-form',
    //   JSON.stringify(formValues)
    // );
  }
  submitAstrologerBankForm(): void {
    let formBankValues = this.bankDetailsForm.value;
    const astrologer_personal_form = JSON.parse(
      localStorage.getItem('astrologer-personal-form')
    );

    const astrologer_professioal_form = JSON.parse(
      localStorage.getItem('astrologer-professioal-form')
    );

    astrologer_personal_form['dateOfBirth'] = new Date(
      astrologer_personal_form['dateOfBirth'].year,
      astrologer_personal_form['dateOfBirth'].month - 1,
      astrologer_personal_form['dateOfBirth'].day
    );

    const mergeAllData = {
      ...astrologer_personal_form,
      ...astrologer_professioal_form,
      ...formBankValues,
    };
    this.userService
      .CreateAstrologer(
        this.authService.activeUserValue['uid'],
        mergeAllData,
        this.linkCode
      )
      .then((data) => {
        console.log('thiis is saved data :', data);
      });
    alert('Thanks Yet work On this');
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

    this.userService
      .CreateUser(formValues)
      .then((data) => {
        this.activeModal.close({ response: true });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  onFileSelected(event: Event) {
    const inputElement = this.fileInput.nativeElement;
    const selectedFile = inputElement.files[0]; // Get the first selected file
    if (selectedFile) {
      const storageRef = ref(
        this.storage,
        '/astrolger/data/webapp/user/' + `qazzxcdaq/` + selectedFile.name
      );
      const task = uploadBytesResumable(storageRef, selectedFile);

      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadProgress = progress;
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log('this is an error while uploading file');
        },
        () => {
          getDownloadURL(storageRef).then((data) => {
            this.personalForm.patchValue({
              uploadedImage: data,
            });
            // this.userService
            //   .UpdateUser(this.authService.activeUserValue['uid'], {
            //     profilePicUrl: data,
            //   })
            //   .then((data) => {
            //     this.userService.fetchUserData(
            //       this.userService.getUserData.uid
            //     );
            //     // this.uploadProgress = 0;
            //     this.activeModal.close({ response: true });
            //   })
            //   .catch((error: any) => {
            //     console.log(error);
            //   });
          });
        }
      );
    }
  }
  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
