import { Injectable, ApplicationModule } from '@angular/core';
import { CypressTest } from '../../../api/models/cypress-test.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CypressTestService {

  constructor(
    private http: HttpClient
  ) {

  }


  getLast(callback, errorCallback): void {
    this.http.get(`/api/cypress-test/last`).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        errorCallback(err);
      }
    )
  }

  create(cypresstest: CypressTest, callback): void {
    this.http.post('/api/cypress-test', cypresstest).subscribe(
      (res) => {
        callback(res);
      },
      (err) => {
        callback(false);
      })
  }

}