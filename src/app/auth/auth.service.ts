import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private isAdmin = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private users: AuthData[] = [];
  private usersUpdated = new Subject<AuthData[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  createUser(username: string, password: string) {
    const authData: AuthData = {username: username, password: password}
    this.http.post('http://localhost:3000/api/user/enroll', authData)
      .subscribe(response => {
        console.log(response);
        this.users.push(authData);
        this.usersUpdated.next([...this.users]);
      });
  }

  getUsers() {
    this.http
      .get<{message: string, users: any}>('http://localhost:3000/api/user')
      .pipe(
        map(userData => {
          return userData.users.map(user => {
            return {
              _id: user._id,
              username: user.username,
              type: user.type
            };
          });
        })
      )
    .subscribe(devData => {
      this.users = devData;
      this.usersUpdated.next([...this.users]);
    });
  }

  getUsersUpdatedListener() {
    return this.usersUpdated.asObservable();
  }



  deleteUser(username: string) {
    this.http.delete('http://localhost:3000/api/user/' + username)
      .subscribe(() => {
        const updatedUsers = this.users.filter(user => user.username !== username);
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  login(username: string, password: string) {
    const authData: AuthData = {username: username, password: password};
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          if (authData.username === 'admin') {
            this.isAdmin = true;
            this.adminStatusListener.next(true);
            this.saveUser(authData.username);
          };
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      const username = this.getUser();
      if(username === 'admin') {
        this.isAdmin = true;
      };
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.authStatusListener.next(false);
    this.clearUser();
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  private saveUser(username: string) {
    localStorage.setItem('username', username);
  }

  private clearUser() {
    localStorage.removeItem('username');
  }

  private getUser() {
    const username = localStorage.getItem('username');
    return username;
  }
}
