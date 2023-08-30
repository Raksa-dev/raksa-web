import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Storage } from '@angular/fire/storage';

import { FormBuilder } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import {
  HMSReactiveStore,
  selectIsConnectedToRoom,
  selectIsLocalAudioEnabled,
  selectPeers,
} from '@100mslive/hms-video-store';

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
  selector: 'app-callui',
  templateUrl: './callui.component.html',
  styleUrls: ['./callui.component.scss'],
})
export class CalluiComponent {
  hms;
  hmsActions;
  hmsStore;
  hmsNotifications;

  peersList;

  public connection: boolean = false;
  public peers = [];

  public currentUser = this.userService.getUserData;

  // Firebase
  // public windowRef: any;
  // public formStep: number = 1;
  // public loading: boolean = false;

  constructor(
    private auth: Auth,
    public authService: AuthService,
    public userService: UserService,
    public windowRefService: WindowRefService,
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder
  ) {
    this.hms = new HMSReactiveStore();
    this.hmsActions = this.hms.getActions();
    this.hmsStore = this.hms.getStore();
    this.hmsNotifications = this.hms.getNotifications();
  }

  onConnection(isConnected) {
    // if (isConnected) {
    //   this.connection = isConnected;
    // }
  }
  getData(p) {
    console.log('this is peers :', p);
    this.peers = p;
  }
  // renderPeer(peer) {
  //   const peerTileDiv = document.createElement('div');
  //   const videoElement = document.createElement('video');
  //   const peerTileName = document.createElement('div');
  //   // videoElement.autoplay = true;
  //   // videoElement.muted = true;
  //   // videoElement.playsinline = true;
  //   peerTileName.textContent = peer.id;

  //   // hmsActions.attachVideo(peer.videoTrack, videoElement);

  //   // peerTileDiv.append(videoElement);
  //   // peerTileDiv.append(peerTileName);

  //   // renderedPeerIDs.add(peer.id);
  //   return peerTileDiv;
  // }
  renderPeers(data) {
    console.log('this is render perrs', this.peers);

    console.log('set', new Set(data));
    let renderedPeerIDs = new Set();
    function renderPeer(peer) {
      const peerTileDiv = document.createElement('div');
      const videoElement = document.createElement('video');
      const peerTileName = document.createElement('div');
      // videoElement.autoplay = true;
      // videoElement.muted = true;
      // videoElement.playsinline = true;
      peerTileDiv.textContent = peer.id;

      renderedPeerIDs.add(peer.id);
      // hmsActions.attachVideo(peer.videoTrack, videoElement);

      // peerTileDiv.append(videoElement);
      // peerTileDiv.append(peerTileName);

      // renderedPeerIDs.add(peer.id);
      peerTileDiv.style.height = '200px';
      peerTileDiv.style.width = '300px';
      peerTileDiv.style.color = 'black';

      peerTileDiv.innerHTML = `<h6>${JSON.stringify(peer.id)}</h6>
      <h6>${peer.name}</h6>`;
      // Optionally, set some additional styles
      peerTileDiv.style.backgroundColor = 'white';
      peerTileDiv.style.border = '1px solid black';
      return peerTileDiv;
    }
    // let peers = this.hms;
    const peersContainer = document.getElementById('peers-container');
    console.log('this peers :', peersContainer);
    console.log('this is peeers hello length:', data.length);
    // if (data.length) {
    //   // this.peers = data;
    //   this.getData(data);
    // }
    data.forEach((peer) => {
      // this.peers.push(peer);
      if (!renderedPeerIDs.has(peer.id)) {
        console.log('hoe many times it is entering');
        peersContainer.appendChild(renderPeer(peer));
      }
    });
  }

  ngOnInit(): void {
    // console.log('this is hms :', this.hms);
    // console.log(
    //   'this is hmstore select peers:',
    //   this.hmsStore.getState(selectPeers)
    // );
    // console.log('this is ngonitt');
    console.log('this is perrs ngoniit', this.peers);
    this.hms.triggerOnSubscribe();
    this.hmsStore.subscribe(this.onConnection, selectIsConnectedToRoom);
    this.hmsStore.subscribe(this.renderPeers, selectPeers);
  }

  // onPanelClick(index) {
  //   if (index == 1) {
  //     let userData = this.userService.getUserData;
  //     let allRelations = userData?.relatives;
  //   }
  // }

  async joinRoom() {
    const authToken = await this.hmsActions.getAuthTokenByRoomCode({
      roomCode: 'nqe-rukn-alx',
    });

    this.hmsActions.join({
      userName: 'hello',
      authToken,
    });
  }
  async leaveRoom() {
    await this.hmsActions.leave();
  }

  muteOrUnmute() {
    const mic = this.hmsStore.getState(selectIsLocalAudioEnabled);
    console.log('this is mic :', mic);
    this.hmsActions.setLocalAudioEnabled(!mic);
  }

  onCancel(): void {
    this.activeModal.close({ response: false });
  }
}
