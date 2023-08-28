import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

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
  AuthService,
  UserService,
  WindowRefService,
} from 'src/app/core/services';

// Firebase
import { Auth } from '@angular/fire/auth';
import { Observable, Subject, concat, of, throwError } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private readonly storage: Storage = inject(Storage);

  public currentUser = this.userService.getUserData;

  public uploadProgress = 0;

  // Firebase
  public windowRef: any;
  public formStep: number = 1;
  public loading: boolean = false;

  public signUpForm: FormGroup = this.formBuilder.group({
    gender: [null, [Validators.required]],
    // dateOfBirth: [null, [Validators.required]],
    // birthTime: [null, [Validators.required]],
    // birthPlace: ['', [Validators.required]],
    maritialStatus: [null, [Validators.required]],
  });
  public signUpFormSubmitted: boolean = false;

  public relations: any[] = [];

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
  public relativeSubmitted: boolean = false;

  public profileForm!: FormGroup;
  public profileSubmitted: boolean = false;

  public showPersonalEditForm: boolean = false;
  public showAddRelativeForm: boolean = false;

  public phoneNumber = this.authService.activeUserValue['phoneNumber'];

  movies$: Observable<any>;
  moviesLoading = false;
  moviesInput$ = new Subject<string>();
  selectedMovie: any;
  minLengthTerm = 3;

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
    this.userService.fetchUserData(this.userService.getUserData.uid);
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

  onPanelClick(index) {
    if (index == 1) {
      let userData = this.userService.getUserData;
      let allRelations = userData?.relatives;
      let modifyJson =
        allRelations &&
        allRelations.map((data) => {
          return {
            relation: data?.relation,
            fullName: data?.firstName + ' ' + data?.lastName,
            gender: data?.gender,
            birthDate:
              typeof data?.dateOfBirth == 'object'
                ? data?.dateOfBirth.toDate().toDateString()
                : new Date(data?.dateOfBirth).toDateString(),
            birthTime: data.birthTime,
            birthPlace: data?.birthPlace,
            maritialStatus: data?.maritialStatus,
          };
        });

      this.relations = userData?.relatives ? modifyJson : [];
      this.showAddRelativeForm = false;
    }
    if (index == 0) {
      this.showPersonalEditForm = false;
    }
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
      })
    );
  };

  personalDetailsEditForm(): void {
    this.showPersonalEditForm = !this.showPersonalEditForm;
    if (this.showPersonalEditForm) {
      const userData = this.userService.getUserData;
      this.signUpForm.patchValue({
        gender: userData?.gender,
        maritialStatus: userData?.maritialStatus,
      });
    }
  }

  relationEditForm(): void {
    this.showPersonalEditForm = !this.showPersonalEditForm;
  }

  showAddMembersForm(): void {
    this.showAddRelativeForm = !this.showAddRelativeForm;
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

    // format birthtime
    const hour = formValues['birthTime']?.hour?.toString().padStart(2, '0');
    const minute = formValues['birthTime']?.minute?.toString().padStart(2, '0');
    const second = formValues['birthTime']?.second?.toString().padStart(2, '0');

    const formattedTime = `${hour}:${minute}:${second} ${
      formValues['birthTime']?.hour >= 12 ? 'PM' : 'AM'
    }`;
    //////////////////
    formValues['birthTime'] = formattedTime;
    formValues['birthPlace'] = formValues['birthPlace'].description;

    this.userService
      .AddRelatives(this.authService.activeUserValue['uid'], formValues)
      .then((data) => {
        this.relations = [
          ...this.relations,
          {
            ...formValues,
            fullName: formValues['firstName'] + ' ' + formValues['lastName'],
            birthDate: formValues['dateOfBirth'].toDateString(),
          },
        ];
        this.userService.fetchUserData(this.userService.getUserData.uid);
        this.showAddRelativeForm = false;
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  submitPersonalDetailsForm(): void {
    this.signUpFormSubmitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    let formValues = this.signUpForm.value;

    // formValues['dateOfBirth'] = new Date(
    //   formValues['dateOfBirth'].year,
    //   formValues['dateOfBirth'].month - 1,
    //   formValues['dateOfBirth'].day
    // );

    // // format birthtime
    // const hour = formValues['birthTime']?.hour?.toString().padStart(2, '0');
    // const minute = formValues['birthTime']?.minute?.toString().padStart(2, '0');
    // const second = formValues['birthTime']?.second?.toString().padStart(2, '0');

    // const formattedTime = `${hour}:${minute}:${second} ${
    //   formValues['birthTime']?.hour >= 12 ? 'PM' : 'AM'
    // }`;
    //////////////////
    // formValues['birthTime'] = formattedTime;
    // formValues['birthPlace'] = formValues['birthPlace'].description;

    this.userService
      .UpdateUser(this.authService.activeUserValue['uid'], formValues)
      .then((data) => {
        this.userService.fetchUserData(this.userService.getUserData.uid);
        this.personalDetailsEditForm();
        this.signUpFormSubmitted = false;
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
        '/profilepics/data/webapp/user/' +
          `${this.currentUser['uid']}/` +
          selectedFile.name
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
            this.userService
              .UpdateUser(this.authService.activeUserValue['uid'], {
                profilePicUrl: data,
              })
              .then((data) => {
                this.userService.fetchUserData(
                  this.userService.getUserData.uid
                );
                this.uploadProgress = 0;
                this.activeModal.close({ response: true });
              })
              .catch((error: any) => {
                console.log(error);
              });
          });
        }
      );
    }
  }

  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
