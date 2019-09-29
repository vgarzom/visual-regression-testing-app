import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnTestCreatedService {

  constructor(
  ) { }

  private messageSource: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public message = this.messageSource.asObservable();
  public onTestCreated(value: boolean) {
    this.messageSource.next(value);
  }
}