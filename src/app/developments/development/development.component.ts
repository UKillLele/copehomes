import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';
import { ParamMap, ActivatedRoute } from '@angular/router';


import { DetailsService } from './details.service';
import { Detail } from './details.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-development',
  templateUrl: './development.component.html',
  styleUrls: ['./development.component.css']
})
export class DevelopmentComponent implements OnInit, OnDestroy {
  details: Detail[];
  private devId: string;
  isLoading = false;
  userIsAuthenticated = false;
  private detailsSub: Subscription;
  private authStatusSub: Subscription;


  constructor(
    private detailsService: DetailsService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.devId = paramMap.get('name');
    });
    this.isLoading = true;
    this.detailsSub = this.detailsService
      .getDetailUpdatedListener()
      .subscribe((detail: Detail[]) => {
        this.isLoading = false;
        this.details = detail;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  svgHTML(dev: { svg: string }) {
    return this.sanitizer.bypassSecurityTrustHtml(dev.svg);
  }
  svgStyle(dev: { svgStyle: string }) {
    return this.sanitizer.bypassSecurityTrustStyle(dev.svgStyle);
  }
  mapUrl(dev: { map: string }) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(dev.map);
  }

  ngOnDestroy() {
    this.detailsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
