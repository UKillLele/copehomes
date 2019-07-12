import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { DevsService } from '../developments.service';
import { Development } from '../development.model';
import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-development-edit',
  templateUrl: './development-edit.component.html',
  styleUrls: ['../developments.component.css']
})
export class DevelopmentEditComponent implements OnInit {
  isLoading = false;
  private devId: string;
  development: Development;
  form: FormGroup;
  logoPreview: string;

  constructor(
    public service: DevsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup ({
      name: new FormControl(null, {validators: [Validators.required]}),
      logo: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      location: new FormControl(null, {validators: [Validators.required]}),
      build: new FormControl(null, {validators: [Validators.required]}),
      startingPrice: new FormControl(null, {validators: [Validators.required]}),
      lots: new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.devId = paramMap.get('devId');
      this.isLoading = true;
      this.service.getDevelopment(this.devId).subscribe(devData => {
        this.isLoading = false;
        this.development = {
          _id: devData._id,
          name: devData.name,
          logoPath: devData.logoPath,
          location: devData.location,
          build: devData.build,
          startingPrice: devData.startingPrice,
          lots: devData.lots
        };
        this.logoPreview = this.development.logoPath;
        this.form.setValue({
          name: this.development.name,
          logo: this.development.logoPath,
          location: this.development.location,
          build: this.development.build,
          startingPrice: this.development.startingPrice,
          lots: this.development.lots
        });
      });
    });
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
    this.service.updateDevelopment(this.devId, this.form.value.name, this.form.value.logo, this.form.value.location, this.form.value.build, this.form.value.startingPrice, this.form.value.lots);
    this.form.reset();
  }
}
