import { Component, OnInit } from '@angular/core';
import { CypressTestService } from 'src/app/service-clients/cypress-test.service';
import { CypressTest } from '../../../../api/models/cypress-test.model';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {

  cypressTests: CypressTest[] = [];

  constructor(
    private cypressTestService: CypressTestService
  ) { }

  ngOnInit() {
    this.cypressTestService.getAll(
      res => {
        console.log("res", res);
        this.cypressTests = res;
      },
      err => {

      });
  }

  getPath(data, position) {
    if (data.screenshots.length > position) {
      return "public/" + data.screenshots[position].name;
    }
  }

}
