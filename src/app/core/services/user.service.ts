import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  Firestore,
  doc,
  getDoc,
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
  constructor(private firestore: Firestore) {}

  private userData;

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

  async fetchUserData(userId, authData?) {
    const userRef = doc(this.firestore, 'users', userId);
    const data = (await getDoc(userRef)).data();
    if (data['isAstrologer']) {
      // get astolrget data
      const astroRef = doc(this.firestore, 'astrologers', userId);
      const astrodata = (await getDoc(astroRef)).data();
      this.userData = { ...data, astrodata, phoneNumber: authData };
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
    const userRef = collection(this.firestore, 'create_astrologers_form_links');
    const saveData = await addDoc(userRef, {
      code,
      submitted: false,
    });
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
    setDoc(astroUserRef, { isAstrologer: true });
    setDoc(astroRef, data);
    return updateDoc(astroLinkRef, { submitted: true });
  }
}
