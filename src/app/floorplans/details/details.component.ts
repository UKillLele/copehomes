import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { HomesService } from '../sitebuilt/sitebuilt.service';
import { Home } from '../sitebuilt/home';
import { ManufacturedsService } from '../manufactured/manufactured.service';
import { Manufactured } from '../manufactured/manufactured';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  home$: Observable<Home>;
  manufactured$: Observable<Manufactured>;
  selectedId: string;


  constructor(
  private service: HomesService,
  private service1: ManufacturedsService,
  private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.home$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = params.get('name');
        return this.service.getHome(params.get('name'));
      })
    );
    this.manufactured$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = params.get('name');
        return this.service1.getManufactured(params.get('name'));
      })
    );
  }
}
