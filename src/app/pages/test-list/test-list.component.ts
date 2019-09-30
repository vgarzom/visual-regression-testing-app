import { Component, OnInit, OnDestroy } from '@angular/core';
import { CypressTestService } from 'src/app/service-clients/cypress-test.service';
import { CypressTest } from '../../../../api/models/cypress-test.model';
import { OnTestCreatedService } from 'src/app/service-clients/ont-test-created.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit, OnDestroy {
  private onTestCreatedSubscription: Subscription;
  cypressTests: CypressTest[] = [];

  constructor(
    private cypressTestService: CypressTestService,
    private onTestCreatedService: OnTestCreatedService
  ) { }

  ngOnInit() {
    this.onTestCreatedSubscription = this.onTestCreatedService.message.subscribe(m => {
      this.updateTestsList();
    });
  }
  ngOnDestroy() {
    this.onTestCreatedSubscription.unsubscribe();
  }

  updateTestsList(): void {
    this.cypressTestService.getAll(
      res => {
        console.log("res", res);
        this.cypressTests = res;
      },
      err => {

      });
  }

  getPath(data, position) {
    console.log("get path", data, position);
    if (position === "diff") {
      return "public/" + data.resemble.img;
    }
    if (data.screenshots.length > position) {
      return "public/" + data.screenshots[position].name;
    }
  }

  getSummaryBackgroundStyle(key: string, data: any): any {
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
