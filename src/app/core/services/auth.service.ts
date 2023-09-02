import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { UserService } from './user.service';
import { Router } from '@angular/router';
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
    public router: Router
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
}
