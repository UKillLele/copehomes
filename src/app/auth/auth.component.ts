import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthData } from './auth-data.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  userIsAuthenticated = false;
  userIsAdmin = false;
  users: AuthData[] = [];
  private usersSub: Subscription;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;

  constructor(public service: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.service.getIsAuth();
    this.userIsAdmin = this.service.getIsAdmin();
    this.authListenerSubs = this.service.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
    this.adminListenerSubs = this.service.getAdminStatusListener().subscribe(
      isAdmin => {
        this.userIsAdmin = isAdmin;
      }
    );
    this.service.getUsers();
    this.usersSub = this.service.getUsersUpdatedListener()
      .subscribe((users: AuthData[]) => {
        this.isLoading = false;
        this.users = users;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.login(form.value.username, form.value.password);
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.createUser(form.value.username, form.value.password);
  }

  onDelete(username: string) {
    this.service.deleteUser(username);
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
  }

}
