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
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  CreateUser(userData: any): any {
    const userRef = doc(this.firestore, 'users', userData.uid);
    return setDoc(userRef, userData);
  }

  UpdateUser(id: string, userData: any): any {
    const userRef = doc(this.firestore, 'users', id);
    return updateDoc(userRef, userData);
  }
}
