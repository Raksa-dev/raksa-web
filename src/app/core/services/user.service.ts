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
  increment,
} from '@angular/fire/firestore';
import { encodeRequest, signRequest } from 'src/app/helpers';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  marchentId = 'RAKSAONLINE';
  saltIndex = 1;
  saltKey = 'ba273d65-f2a8-4b07-86e5-5d9f06390ab3';
  BASE_URL_PROD = 'https://raksa.tech';
  BASE_URL_LOCAL = 'http://localhost:3000';
  BASE_URL = this.BASE_URL_PROD;
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
  async importDataFromJson() {
    // const data = await this.http.get('/assets/MonthlyHoroscope.json');
    // data.subscribe((dataum: []) => {
    // let yearlycollectinRef = collection(
    //   this.firestore,
    //   'horoscopes',
    //   'monthly',
    //   'data'
    // );
    // dataum.forEach((element) => {
    //   console.log(element);
    //   addDoc(yearlycollectinRef, element);
    // });
    // });
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
  async GetCcavenuePaymentForm(amount, userId) {
    var randomNumber = Math.floor(Math.random() * 900) + 100;
    const order_ID = `Astro_${randomNumber}_${userId}`;
    return this.http.post(
      'https://raksa.tech/api/request',
      {
        orderParams: {
          order_id: order_ID,
          amount: amount,
          language: 'en',
        },
        keys: {
          working_key: '02182BD7D50FAF0553F00BC70A412F8C',
          access_code: 'AVIA09KI06AB67AIBA',
        },
      },
      {
        responseType: 'text',
      }
    );
  }
  async GetPhonePayPaymentForm(amount, userId, mobileNumber?: string) {
    var randomNumber = Math.floor(Math.random() * 900) + 100;
    const order_ID = `pe_${randomNumber}_${userId}`;
    const body = {
      merchantId: this.marchentId,
      merchantTransactionId: order_ID,
      merchantUserId: userId,
      amount: amount * 100, // converted in paise as per the document
      mobileNumber: mobileNumber ? mobileNumber : '',
      redirectUrl: `${this.BASE_URL}/api/phonepe/response`,
      redirectMode: 'POST',
      callbackUrl: `${this.BASE_URL}/api/phonepe/response`,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };
    const encodeBody = encodeRequest(body);
    const dataUserForCheckSumCreation = signRequest(
      encodeBody + '/pg/v1/pay' + this.saltKey
    );
    const X_VERIFY = dataUserForCheckSumCreation + '###' + this.saltIndex;
    console.log('this is data user :', dataUserForCheckSumCreation);

    return this.http.post(
      'https://api.phonepe.com/apis/hermes/pg/v1/pay',
      { request: encodeBody },
      {
        headers: { 'Content-Type': 'application/json', 'X-VERIFY': X_VERIFY },
      }
    );
  }
  async updateUserWalletAmount(
    amount,
    userId,
    order_id,
    tracking_id = '',
    failure_message = '',
    status = '',
    status_message = ''
  ) {
    const userRef = doc(this.firestore, 'users', userId);
    const updatedData = await setDoc(
      userRef,
      {
        walletBalance: increment(amount),
        transactions: arrayUnion(order_id),
      },
      {
        merge: true,
      }
    );
    const transRef = doc(this.firestore, 'transactions', order_id);
    const createTransaction = await setDoc(transRef, {
      id: order_id,
      date: new Date(),
      receiptId: tracking_id,
      rechargeAmount: amount,
      userId: userId,
      status,
      failure_message,
      status_message,
    });

    return updatedData;
  }
  async updateUserWalletAmountForElse(
    amount,
    userId,
    order_id,
    tracking_id = '',
    failure_message = '',
    status = '',
    status_message = ''
  ) {
    const userRef = doc(this.firestore, 'users', userId);
    const updatedData = await setDoc(
      userRef,
      {
        transactions: arrayUnion(order_id),
      },
      {
        merge: true,
      }
    );
    const transRef = doc(this.firestore, 'transactions', order_id);
    const createTransaction = await setDoc(transRef, {
      id: order_id,
      date: new Date(),
      receiptId: tracking_id,
      rechargeAmount: amount,
      userId: userId,
      status,
      failure_message,
      status_message,
    });

    return updatedData;
  }
  async checkForTrx(tranxId) {
    const transRef = doc(this.firestore, 'transactions', tranxId);
    const data = await getDoc(transRef);
    return data.data();
  }
}
