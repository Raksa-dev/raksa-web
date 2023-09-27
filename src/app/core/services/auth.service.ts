import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import {
  Firestore,
  collectionData,
  collection,
  where,
  query,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public activeUserSubject: BehaviorSubject<any | null>;
  public activeUser: Observable<any | null>;

  public get activeUserValue() {
    return this.activeUserSubject.value;
  }

  constructor(
    private auth: Auth,
    public userService: UserService,
    public router: Router,
    public firestore: Firestore
  ) {
    this.activeUserSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('raksa-user')!)
    );
    this.activeUser = this.activeUserSubject.asObservable();

    onAuthStateChanged(this.auth, (user: any) => {
      if (user) {
        localStorage.setItem('raksa-user', JSON.stringify(user));
        this.activeUserSubject.next(user);

        this.userService.fetchUserData(user?.uid);
      } else {
        this.activeUserSubject.next(null);
        localStorage.removeItem('raksa-user');
      }
    });
  }

  SignOut() {
    signOut(this.auth)
      .then(() => {
        console.log('User signed out successfully!');
        this.router.navigateByUrl('/');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async getDailyHoroscope(zodiac, date): Promise<Observable<any>> {
    const coll = collection(this.firestore, 'horoscopes');
    const q1 = query(
      coll,
      where('sign', '==', zodiac),
      where('current_date', '==', date)
    );
    const data = collectionData(q1, { idField: 'id' });
    return data;
  }
  async getMonthlyHoroscope(zodiac, date): Promise<Observable<any>> {
    console.log(zodiac, date);

    const coll = collection(this.firestore, 'horoscopes', 'monthly', 'data');
    const q1 = query(
      coll,
      where('sign', '==', zodiac),
      where('month', '==', date)
    );
    const data = collectionData(q1, { idField: 'id' });
    return data;
  }
  async getYearlyHoroscope(zodiac): Promise<Observable<any>> {
    const coll = collection(this.firestore, 'horoscopes', 'yearly', 'data');
    const q1 = query(coll, where('Sign', '==', zodiac));
    const data = collectionData(q1, { idField: 'id' });
    return data;
  }
}
