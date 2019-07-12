import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { HomesService } from './sitebuilt.service';
import { Home } from './home';

@Component({
  selector: 'app-sitebuilt',
  templateUrl: './sitebuilt.component.html',
  styleUrls: ['./sitebuilt.component.css']
})
export class SitebuiltComponent implements OnInit {
  homes$: Observable<Home[]>;
  selectedId: string;


  constructor(
  private service: HomesService,
  private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.homes$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.selectedId = params.get('name');
        return this.service.getHomes();
      })
    );
  }
}
