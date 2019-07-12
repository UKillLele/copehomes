import { Component, OnInit} from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { DetailsService } from '../details.service';
import { Detail } from '../details.model';
import { mimeType } from '../../mime-type.validator';

@Component({
  selector: 'app-details-edit',
  templateUrl: './details-edit.component.html',
  styleUrls: ['./details-edit.component.css']
})
export class DetailsEditComponent implements OnInit {
  isLoading = false;
  private detailId: string;
  detail: Detail;
  form: FormGroup;
  logoPreview: string;
  platPreview: string;
  svgPreview: string;
  private mode = "create";


  constructor(
  public service: DetailsService,
  public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup ({
      name: new FormControl(null, {validators: [Validators.required]}),
      logo: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      location: new FormControl(null, {validators: [Validators.required]}),
      build: new FormControl(null, {validators: [Validators.required]}),
      startingPrice: new FormControl(null, {validators: [Validators.required]}),
      lots: new FormControl(null, {validators: [Validators.required]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      plat: new FormControl(null, {validators: [Validators.required]}),
      svg: new FormControl(null, {validators: [Validators.required]}),
      svgStyle: new FormControl(null, {validators: [Validators.required]}),
      map: new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('detailId')) {
        this.detailId = paramMap.get('detailId');
        this.isLoading = true;
        this.service.getDetail(this.detailId).subscribe(detailData => {
          this.isLoading = false;
          this.detail = {
            _id: detailData._id,
            name: detailData.name,
            logoPath: detailData.logoPath,
            location: detailData.location,
            build: detailData.build,
            startingPrice: detailData.startingPrice,
            lots: detailData.lots,
            description: detailData.description,
            platPath: detailData.platPath,
            svgPath: detailData.svgPath,
            svgStyle: detailData.svgStyle,
            map: detailData.map
          };
          this.logoPreview = this.detail.logoPath;
          this.form.setValue({
            name: this.detail.name,
            logo: this.detail.logoPath,
            location: this.detail.location,
            build: this.detail.build,
            startingPrice: this.detail.startingPrice,
            lots: this.detail.lots,
            description: this.detail.description,
            plat: this.detail.platPath,
            svg: this.detail.svgPath,
            svgStyle: this.detail.svgStyle,
            map: this.detail.map
          });
        });
    } else {
      this.mode = "create";
      this.detailId = null;
    }
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

  onPlatPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({plat: file});
    this.form.get('plat').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.platPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSvgPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({svg: file});
    this.form.get('svg').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.svgPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveDetail() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.service.updateDetail(this.detailId, this.form.value.name, this.form.value.logo, this.form.value.location, this.form.value.build, this.form.value.startingPrice, this.form.value.lots, this.form.value.description, this.form.value.plat, this.form.value.svg, this.form.value.svgStyle, this.form.value.map);
    } else {
      this.service.updateDetail(this.detailId, this.form.value.name, this.form.value.logo, this.form.value.location, this.form.value.build, this.form.value.startingPrice, this.form.value.lots, this.form.value.description, this.form.value.plat, this.form.value.svg, this.form.value.svgStyle, this.form.value.map);
    }
    this.form.reset();
  }
}
