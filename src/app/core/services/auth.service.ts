import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
    Auth,
    onAuthStateChanged,
    signOut
} from '@angular/fire/auth';

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
        private auth: Auth
    ) {
        this.activeUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('raksa-user')!));
        this.activeUser = this.activeUserSubject.asObservable();
        
        onAuthStateChanged(this.auth, (user: any) => {
            if (user) {
                this.activeUserSubject.next(user);
                localStorage.setItem('raksa-user', JSON.stringify(user)); 
            } else {
                this.activeUserSubject.next(null);
                localStorage.removeItem('raksa-user');       
            }
        })
    }
    
    SignOut() {
        signOut(this.auth).then(() => {
            console.log("User signed out successfully!")
        }).catch((error) => {
            console.log(error);
        });
    }
}