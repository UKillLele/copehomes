import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Home } from './home';
import { HOMES } from './homes';

@Injectable({
  providedIn: 'root',
})
export class HomesService {

  constructor() { }

  getHomes(): Observable<Home[]> {
    return of(HOMES);
  }

  getHome(name: string) {
    return this.getHomes().pipe(
      // (+) before `id` turns the string into a number
      map((homes: Home[]) => homes.find(home => home.name === name))
    );
  }
}
