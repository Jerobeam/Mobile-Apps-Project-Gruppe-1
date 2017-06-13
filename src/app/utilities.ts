/**
 * Created by Sebastian on 20.12.2016.
 */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';


@Injectable()
export class Utilities {

  resolutions = [
    { name: "Running", isPreconfigured: true, isActive: false, isDone: false },
    { name: "Stop Smoking", isPreconfigured: true, isActive: true, isDone: false },
    { name: "Lose Weight", isPreconfigured: true, isActive: false, isDone: false },
    { name: "Football", isPreconfigured: false, isActive: true, isDone: true },
    { name: "Socialize", isPreconfigured: true, isActive: false, isDone: false, contacts: [] }
  ];

  getResolutions() {
    return this.resolutions;
  }

  constructor() {

  }

}



