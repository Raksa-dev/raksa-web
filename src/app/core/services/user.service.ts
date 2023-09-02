import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
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
    this.userData = { ...data, phoneNumber: authData };
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
}
