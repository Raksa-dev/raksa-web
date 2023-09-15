import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatuiComponent } from '../chatui/chatui.component';
import {
  AstrologerService,
  AuthService,
  UserService,
} from 'src/app/core/services';

@Component({
  selector: 'app-chatnotifications',
  templateUrl: './chatnotifications.component.html',
  styleUrls: ['./chatnotifications.component.scss'],
})
export class ChatnotificationsComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public authService: AuthService,
    public astroService: AstrologerService,
    public userservice: UserService
  ) {}

  @Input() notificaitionData;

  ngOnInit(): void {
  }
  async openChatWindow(notificationData) {
    // steps
    // 1.create room code and room
    // 2 send notification to user to chat with astro in that send room code if possible
    // 3.send room detaisl to chatui compoment plus user tpye
    // 4.once room created please don't create the room instead direclt take him to the room

    let roomCode;
    if (this.userservice.getUserData['isAstrologer']) {
      roomCode =
        this.userservice.getUserData['uid'] +
        '+' +
        notificationData['senderId'];
    } else {
      roomCode =
        notificationData['senderId'] +
        '+' +
        this.userservice.getUserData['uid'];
    }

    const createRoomAndMessage =
      await this.astroService.createRoomAndAddMessage(
        roomCode,
        this.userservice.getUserData
      );
    this.activeModal.close({ response: false });

    if (createRoomAndMessage.isRoomThere) {
      // now check whether nofication gone to the user
      // if (this.userservice.getUserData['isAstrologer']) {
      // }
      const notify = await this.userservice.NotifyUserForChat(
        this.userservice.getUserData,
        notificationData
      );
      let modelRef = this.modalService.open(ChatuiComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      });
      modelRef.componentInstance.parentData = {
        userIsAstrologer: this.userservice.getUserData['isAstrologer'],
        roomCode,
        notificationData,
      };
    } else {
      const notify = await this.userservice.NotifyUserForChat(
        this.userservice.getUserData,
        notificationData
      );
      // notify user that room has been created
      let modelRef = this.modalService.open(ChatuiComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'lg',
        scrollable: true,
      });
      modelRef.componentInstance.parentData = {
        userIsAstrologer: this.userservice.getUserData['isAstrologer'],
        roomCode,
        notificationData,
      };
    }
  }

  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
