import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { ManufacturedsService } from './manufactured.service';
import { Manufactured } from './manufactured';

@Component({
  selector: 'app-sitebuilt',
  templateUrl: './manufactured.component.html',
  styleUrls: ['./manufactured.component.css']
})
export class ManufacturedComponent implements OnInit {
  manufactureds$: Observable<Manufactured[]>;
  selectedId: string;


  constructor(
  private service: ManufacturedsService,
  private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.manufactureds$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = params.get('name');
        return this.service.getManufactureds();
      })
    );
  }
}
