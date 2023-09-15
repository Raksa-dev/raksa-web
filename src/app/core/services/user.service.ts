import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  Firestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  collection,
  where,
  query,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private http: HttpClient) {}

  public userData;

  get getUserData() {
    return this.userData;
  }

  set setUserData(data: any) {
    this.userData = data;
  }

  async getDataFromUserCollection(userId, authData?) {
    const userRef = doc(this.firestore, 'users', userId);
    const data = (await getDoc(userRef)).data();
    let allData = { ...data, phoneNumber: authData };
    return allData;
  }

  async getUserDataInfo(userId) {
    let userData = {};
    const userRef = doc(this.firestore, 'users', userId);
    let data = (await getDoc(userRef)).data();
    userData = { ...data };
    if (data && data['isAstrologer']) {
      const astoRef = doc(this.firestore, 'astrologers', userId);
      const astrodata = (await getDoc(astoRef)).data();
      return astrodata;
    }
    return userData;
  }

  async fetchUserData(userId, authData?) {
    const userRef = doc(this.firestore, 'users', userId);
    const data = (await getDoc(userRef)).data();
    if (data && data['isAstrologer']) {
      // get astolrget data
      const astroRef = doc(this.firestore, 'astrologers', userId);
      const astrodata = (await getDoc(astroRef)).data();
      this.userData = { ...data, ...astrodata, phoneNumber: authData };
    } else {
      this.userData = { ...data, phoneNumber: authData };
    }
  }
  async CreateUser(userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'users', userData.uid);
    return setDoc(userRef, userData);
  }
  async UpdateUser(id: string, userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'users', id);
    return updateDoc(userRef, userData);
  }
  async UpdateAstroUser(id: string, userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'astrologers', id);
    return updateDoc(userRef, userData);
  }
  async AddRelatives(id: string, userData: any): Promise<any> {
    const userRef = doc(this.firestore, 'users', id);
    return setDoc(
      userRef,
      { relatives: arrayUnion(userData) },
      {
        merge: true,
      }
    );
  }
  async AdminLinkCreation(code: string): Promise<any> {
    const userRef = doc(this.firestore, 'create_astrologers_form_links', code);

    const saveData = await setDoc(
      userRef,
      {
        code,
        submitted: false,
      },
      {
        merge: true,
      }
    );
    return saveData;
  }
  async CreateAstrologer(userid, data, code): Promise<any> {
    const astroUserRef = doc(this.firestore, 'users', userid);
    const astroRef = doc(this.firestore, 'astrologers', userid);
    const astroLinkRef = doc(
      this.firestore,
      'create_astrologers_form_links',
      code
    );
    setDoc(astroUserRef, {
      isAstrologer: true,
      dateOfBirth: '',
      firstName: '',
      lastName: '',
      birthPlace: '',
      gender: '',
      profilePicUrl: '',
      maritialStatus: '',
    });
    setDoc(astroRef, data);
    return updateDoc(astroLinkRef, { submitted: true });
  }
  async checkNotificationIsThere(userId, senderId, type) {
    const notificationsRef = collection(
      this.firestore,
      'notifications',
      userId,
      'notifications'
    );
    const q = query(
      notificationsRef,
      where('senderId', '==', senderId),
      where('isRead', '==', false),
      where('type', '==', type)
    );
    const data = await getDocs(q);
    return data;
  }
  async NotifyAstrologerForChat(astrologerData, userData) {
    const alreadyNotificationPresent = await this.checkNotificationIsThere(
      astrologerData['uid'],
      userData['uid'],
      'chat'
    );
    if (alreadyNotificationPresent?.size) {
      // notification present
      return true;
    } else {
      const notificationsRef = collection(
        this.firestore,
        'notifications',
        astrologerData['uid'],
        'notifications'
      );
      addDoc(notificationsRef, {
        type: 'chat',
        isRead: false,
        body: 'Want to Chat',
        date: new Date(),
        title: `hey ${
          userData['firstName'] + ' ' + userData['lastName']
        } wants to chat with you`,
        senderId: userData['uid'],
        senderName: userData['firstName'],
        profilePicUrl: userData['profilePicUrl']
          ? userData['profilePicUrl']
          : '',
      });
      return true;
    }
  }
  async NotifyUserForChat(userData, notificaitionData) {
    const alreadyNotificationPresent = await this.checkNotificationIsThere(
      notificaitionData['senderId'],
      userData['uid'],
      'chat'
    );

    if (alreadyNotificationPresent?.size) {
      return true;
    } else {
      const notificationsRef = collection(
        this.firestore,
        'notifications',
        notificaitionData['senderId'],
        'notifications'
      );
      addDoc(notificationsRef, {
        type: 'chat',
        isRead: false,
        body: 'Want to Chat',
        date: new Date(),
        title: `hey ${
          userData['firstName'] + ' ' + userData['lastName']
        } wants to chat with you`,
        senderId: userData['uid'],
        senderName: userData['firstName'],
        profilePicUrl: userData['profilePicUrl'],
      });
      return false;
    }
  }
  async MarkNotificationForChatAsRead(userId, NotificationId) {
    const notificationsRef = doc(
      this.firestore,
      'notifications',
      userId,
      'notifications',
      NotificationId
    );
    const update = await updateDoc(notificationsRef, {
      isRead: true,
    });
    return update;
  }
  async GetCcavenuePaymentForm() {
    return this.http.post(
      'https://raksa.tech/api/request',
      {
        order_id: 'DASKJDNQWJND_userId',
        amount: 1000,
        currency: 'INR',
        language: 'en',
      },
      {
        responseType: 'text',
      }
    );
  }
}
