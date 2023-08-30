import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
  getDoc,
  addDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Auth } from 'firebase/auth';
import { Subscription, interval } from 'rxjs';
import {
  AuthService,
  UserService,
  WindowRefService,
} from 'src/app/core/services';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-chatui',
  templateUrl: './chatui.component.html',
  styleUrls: ['./chatui.component.scss'],
})
export class ChatuiComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    // private auth: Auth,
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private http: HttpClient,
    private ngZone: NgZone,
    public firestore: Firestore
  ) {}
  private readonly storage: Storage = inject(Storage);

  currentUser = this.userService?.getUserData;
  messageText: string = '';
  timer: number = 0;
  timerSubscription: Subscription;
  confirmationOverlay: boolean = false;
  imagePreview: string | null = null;
  sendImageInMessage = false;
  downloadFile = false;

  messages;

  ngOnInit() {
    const storedTimer = localStorage.getItem('chatTimer');
    this.timer = storedTimer ? parseInt(storedTimer, 10) : 0;
    this.ngZone.runOutsideAngular(() => {
      this.startTimer();
    });
    window.onbeforeunload = () => {
      localStorage.setItem('chatTimer', this.timer.toString());
    };
    this.fetchData();
  }

  async fetchData() {
    const chatRoomCollection = collection(
      this.firestore,
      'chatRooms/hello',
      'messages'
    );

    const q = query(chatRoomCollection, orderBy('time'));

    const newData = collectionData(q);

    newData.subscribe((data) => {
      this.messages = data;
      this.scrollToBottom();
    });
  }

  openConfirmation(): void {
    this.confirmationOverlay = true;
  }

  continue(): void {
    this.confirmationOverlay = false;
  }
  endChat(): void {
    this.confirmationOverlay = false;
    let timeChateed = this.formatTime(this.timer);
    const storedTimer = localStorage.removeItem('chatTimer');
    this.activeModal.close({ response: false });

    // end chat logic in this function
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the timer when the component is destroyed
    this.timerSubscription.unsubscribe();
    window.onbeforeunload = null;
  }
  startTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.ngZone.run(() => {
          this.timer++;
        });
      });
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  async sendMessage(type: string = 'text', file_url: string = '') {
    try {
      if (this.messageText.trim() !== '') {
        const chatRoomCollection = collection(
          this.firestore,
          'chatRooms/hello',
          'messages'
        );

        const docRef = await addDoc(chatRoomCollection, {
          text: this.messageText,
          file_url: file_url,
          isRead: false,
          mediaUrl: '',
          message: 'hi',
          receiverId: '',
          receiverName: 'some name',
          receiverPhotoUrl:
            'https://firebasestorage.googleapis.com/v0/b/raksa-1e906.appspot.com/o/profilepics%2Fdata%2Fuser%2F0%2Fcom.example.raksa%2Fcache%2F14e38a7a-0b58-479e-8efe-b6d197f9e85a%2F1000021856.jpg2023-07-29%2012%3A16%3A56.346867%7D?alt=media&token=81f6e22c-876e-4e9b-ba1c-65dd25409791',
          senderId: this.currentUser.uid,
          senderIsAstrologer: false,
          senderName: 'name',
          senderPhotoUrl:
            'https://firebasestorage.googleapis.com/v0/b/raksa-1e906.appspot.com/o/profilepics%2Fdata%2Fuser%2F0%2Fcom.example.raksa%2Fcache%2F14e38a7a-0b58-479e-8efe-b6d197f9e85a%2F1000021856.jpg2023-07-29%2012%3A16%3A56.346867%7D?alt=media&token=81f6e22c-876e-4e9b-ba1c-65dd25409791',
          time: new Date(),
          type: type,
        });
        this.messageText = ''; // Clear the input field
      }
    } catch (error) {}
  }

  async sendImageMessage() {
    const inputElement = this.fileInput.nativeElement;
    const selectedFile = inputElement.files[0];

    if (selectedFile) {
      const storageRef = ref(
        this.storage,
        `/messages/data/webapp/user/` +
          `${this.currentUser['uid']}/` +
          selectedFile.name
      );
      const task = uploadBytesResumable(storageRef, selectedFile);

      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // this.uploadProgress = progress;
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
            // this.userService
            //   .UpdateUser(this.authService.activeUserValue['uid'], {
            //     profilePicUrl: data,
            //   })
            //   .then((data) => {
            //     this.userService.fetchUserData(
            //       this.userService.getUserData.uid
            //     );
            //     // this.uploadProgress = 0;
            //     this.confirmationOverlay = false;
            //     this.sendImageInMessage = false;
            //     this.activeModal.close({ response: true });
            //   })
            //   .catch((error: any) => {
            //     console.log(error);
            //   });
            if (this.sendMessage('image_text', data)) {
              this.confirmationOverlay = false;
              this.sendImageInMessage = false;
            }
          });
        }
      );
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.confirmationOverlay = true;
      this.sendImageInMessage = true;
    }
  }

  downloadFileFromChat(fileData) {
    this.imagePreview = fileData?.file_url;
    this.confirmationOverlay = true;
    this.sendImageInMessage = true;
    this.downloadFile = true;
  }
  closeOverlay() {
    this.confirmationOverlay = false;
    this.sendImageInMessage = false;
    this.downloadFile = false;
    this.messageText = '';
  }
}
