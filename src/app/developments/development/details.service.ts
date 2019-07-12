import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import { Detail } from './details.model';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  private details: Detail[] = [];
  private detailsUpdated = new Subject<Detail[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getDetailUpdatedListener() {
    return this.detailsUpdated.asObservable();
  }

  getDetail(name: string) {
    return this.http.get<{
      _id: string,
      name: string,
      logoPath: string,
      location: string,
      build: string,
      startingPrice: string,
      lots: string,
      description: string,
      platPath: string,
      svgPath: string,
      svgStyle: string,
      map: string
    }>('http://localhost3000/api/detail' + name);
  }

  addDetail(name: string, logo: File, location: string, build: string, startingPrice: string, lots: string, description: string, plat: File, svg: File, svgStyle: string, map: string) {
    const detailData = new FormData();
    detailData.append('name', name);
    detailData.append('logo', logo, name);
    detailData.append('location', location);
    detailData.append('build', build);
    detailData.append('startingPrice', startingPrice);
    detailData.append('lots', lots);
    detailData.append('description', description);
    detailData.append('plat', plat);
    detailData.append('svg', svg);
    detailData.append('svgStyle', svgStyle);
    detailData.append('map', map);
    this.http
      .post<{message: string, detail: Detail}>('http://localhost:3000/api/details', detailData)
      .subscribe(responseData => {
        const detail: Detail = {
          _id: responseData.detail._id,
          name: name,
          logoPath: responseData.detail.logoPath,
          location: location,
          build: build,
          startingPrice: startingPrice,
          lots: lots,
          description: description,
          platPath: responseData.detail.platPath,
          svgPath: responseData.detail.svgPath,
          svgStyle: svgStyle,
          map: map
        };
        console.log("submitting");
        this.details.push(detail);
        this.detailsUpdated.next([...this.details]);
        this.router.navigate(['..']);
    });
  }

  updateDetail(_id: string, name: string, logo: any, location: string, build: string, startingPrice: string, lots: string, description: string, plat: any, svg: any, svgStyle: string, map: string) {
    let detailData: Detail | FormData;
    if (typeof logo === 'object') {
      detailData = new FormData();
      detailData.append('_id', _id);
      detailData.append('name', name);
      detailData.append('logo', logo, name);
      detailData.append('location', location);
      detailData.append('build', build);
      detailData.append('startingPrice', startingPrice);
      detailData.append('lots', lots);
      detailData.append('description', description);
      detailData.append('plat', plat);
      detailData.append('svg', svg);
      detailData.append('svgStyle', svgStyle);
      detailData.append('map', map);
    } else {
      detailData = {
        _id: _id,
        name: name,
        logoPath: logo,
        location: location,
        build: build,
        startingPrice: startingPrice,
        lots: lots,
        description: description,
        platPath: plat,
        svgPath: svg,
        svgStyle: svgStyle,
        map: map
      };
    }
    this.http.put('http://localhost:3000/api/details/' + _id, detailData)
    .subscribe(response => {
      const updateDetails = [...this.details];
      const oldDetailIndex = updateDetails.findIndex(d => d._id === _id);
      const detail: Detail = {
        _id: _id,
        name: name,
        logoPath: "",
        location: location,
        build: build,
        startingPrice: startingPrice,
        lots: lots,
        description: description,
        platPath: "",
        svgPath: "",
        svgStyle: svgStyle,
        map: map
      };
      updateDetails[oldDetailIndex] = detail;
      this.details = updateDetails;
      this.detailsUpdated.next([...this.details]);
      this.router.navigate(['..']);
    });
  }

}
