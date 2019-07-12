import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { DevsService } from '../developments.service';
import { Development } from '../development.model';
import { AuthService } from 'src/app/auth/auth.service';
import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-developments',
  templateUrl: './developments.component.html',
  styleUrls: ['../developments.component.css']
})
export class DevelopmentsComponent implements OnInit, OnDestroy {
  selectedId: string;
  developments: Development[] = [];
  private devsSub: Subscription;
  private authStatusSub: Subscription;
  isLoading = false;
  userIsAuthenticated = false;
  development: Development;
  form: FormGroup;
  logoPreview: string;

  constructor(
  public service: DevsService,
  private authService: AuthService,
  public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.service.getDevelopments();
    this.devsSub = this.service.getDevelopmentUpdatedListener()
      .subscribe((developments: Development[]) => {
        this.isLoading = false;
        this.developments = developments;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
    this.form = new FormGroup ({
      name: new FormControl(null, {validators: [Validators.required]}),
      logo: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      location: new FormControl(null, {validators: [Validators.required]}),
      build: new FormControl(null, {validators: [Validators.required]}),
      startingPrice: new FormControl(null, {validators: [Validators.required]}),
      lots: new FormControl(null, {validators: [Validators.required]})
    });
  }

  onDelete(devId: string) {
    this.service.deleteDevelopment(devId);
  }

  ngOnDestroy() {
    this.devsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onLogoPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({logo: file});
    this.form.get('logo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveDevelopment() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.service.addDevelopment(this.form.value.name, this.form.value.logo, this.form.value.location, this.form.value.build, this.form.value.startingPrice, this.form.value.lots);
    this.form.reset();
  }

}
