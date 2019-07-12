import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Manufactured } from './manufactured';
import { MANUFACTUREDS } from './manufactureds';

@Injectable({
  providedIn: 'root',
})
export class ManufacturedsService {

  constructor() { }

  getManufactureds(): Observable<Manufactured[]> {
    return of(MANUFACTUREDS);
  }

  getManufactured(name: string) {
    return this.getManufactureds().pipe(
      // (+) before `id` turns the string into a number
      map((manufactureds: Manufactured[]) => manufactureds.find(manufactured => manufactured.name === name))
    );
  }
}
