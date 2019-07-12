import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import { Development } from './development.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DevsService {
  private developments: Development[] = [];
  private developmentsUpdated = new Subject<Development[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getDevelopments() {
    this.http
      .get<{message: string, developments: any}>('http://localhost:3000/api/developments')
      .pipe(
        map(devData => {
          return devData.developments.map(development => {
            return {
              _id: development._id,
              name: development.name,
              logoPath: development.logoPath,
              location: development.location,
              build: development.build,
              startingPrice: development.startingPrice,
              lots: development.lots
            };
          });
        })
      )
    .subscribe(devData => {
      this.developments = devData;
      this.developmentsUpdated.next([...this.developments]);
    });
  }
  
  getDevelopmentUpdatedListener() {
    return this.developmentsUpdated.asObservable();
  }

  getDevelopment(_id: string) {
    return this.http.get<{_id: string, name: string, logoPath: string, location: string, build: string, startingPrice: string, lots: string}>(
      'http://localhost:3000/api/developments/' + _id);
  }

  addDevelopment(name: string, logo: File, location: string, build: string, startingPrice: string, lots: string) {
    const devData = new FormData();
    devData.append('name', name);
    devData.append('logo', logo, name);
    devData.append('location', location);
    devData.append('build', build);
    devData.append('startingPrice', startingPrice);
    devData.append('lots', lots);
    this.http
      .post<{message: string, development: Development}>('http://localhost:3000/api/developments', devData)
      .subscribe(responseData => {
        const development: Development = {
          _id: responseData.development._id,
          name: name,
          logoPath: responseData.development.logoPath,
          location: location,
          build: build,
          startingPrice: startingPrice,
          lots: lots
        };
        console.log("submitting");
        this.developments.push(development);
        this.developmentsUpdated.next([...this.developments]);
        this.router.navigate(['/developments']);
    });
  }

  updateDevelopment(_id: string, name: string, logo: any, location: string, build: string, startingPrice: string, lots: string) {
    let devData: Development | FormData;
    if (typeof logo === 'object') {
      devData = new FormData();
      devData.append("_id", _id);
      devData.append('name', name);
      devData.append('logo', logo, name);
      devData.append('location', location);
      devData.append('build', build);
      devData.append('startingPrice', startingPrice);
      devData.append('lots', lots);
    } else {
      devData = {
        _id: _id,
        name: name,
        logoPath: logo,
        location: location,
        build: build,
        startingPrice: startingPrice,
        lots: lots
      };
    }
    this.http.put('http://localhost:3000/api/developments/' + _id, devData)
    .subscribe(response => {
      const updateDevelopments = [...this.developments];
      const oldDevIndex = updateDevelopments.findIndex(d => d._id === _id);
      const development: Development = {
        _id: _id,
        name: name,
        logoPath: "",
        location: location,
        build: build,
        startingPrice: startingPrice,
        lots: lots
      };
      updateDevelopments[oldDevIndex] = development;
      this.developments = updateDevelopments;
      this.developmentsUpdated.next([...this.developments]);
      this.router.navigate(['/developments']);
    });
  }

  deleteDevelopment(devId: string) {
    this.http.delete('http://localhost:3000/api/developments/' + devId)
      .subscribe(() => {
        const updatedDevelopments = this.developments.filter(development => development._id !== devId);
        this.developments = updatedDevelopments;
        this.developmentsUpdated.next([...this.developments]);
      });
  }
}
