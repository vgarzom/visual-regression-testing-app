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

  getSummaryBackgroundStyle(key: string, data:any): any {
    const successColor = "#87d068";
    const errorColor = "#f50";
    const neutralColor = "#2db7f5";

    switch (key) {
      
      case 'tests':
        return {
          "background-color": neutralColor
        }

      case 'passes':
        if (data.reporterStats.passes === data.reporterStats.tests) {
          return {
            "background-color": successColor
          }
        }
        else {
          return {
            "background-color": errorColor
          }
        }

      default:
        return {}

    }
    return {};
  }

}
