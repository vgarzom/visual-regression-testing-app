import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CypressTestService } from './service-clients/cypress-test.service';
import { CypressTest } from '../../api/models/cypress-test.model';
import { OnTestCreatedService } from './service-clients/ont-test-created.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  lastTest: CypressTest = null;
  isSpinning:boolean = false;
  constructor(
    private modalService: NzModalService,
    private cypressTestService: CypressTestService,
    private onTestCreatedService: OnTestCreatedService
  ) { }

  showConfirm(): void {
    let r = this.modalService.confirm({
      nzTitle: 'Iniciar prueba',
      nzContent: 'Una vez inicia la prueba no puede ser cancelada o detenida. ¿Deseas continuar?',
      nzOkText: 'Si',
      nzCancelText: 'No',
      nzOnOk: () => {this.initTest()}
    });

  }

  initTest(): void {
    console.log("starting test");
    this.cypressTestService.create({}, (res) => {
      this.updateLast();
      this.onTestCreatedService.onTestCreated(true);
    })
  }

  ngOnInit() {
    this.updateLast();
  }

  updateLast() {
    this.cypressTestService.getLast(
      res => {
        this.lastTest = res;
      },
      err => {
        console.log("error consultando");
      }
    )
  }

  getSummaryBackgroundStyle(key: string): any {
    const successColor = "#87d068";
    const errorColor = "#f50";
    const neutralColor = "#2db7f5";

    if (this.lastTest === null) {
      return {};
    }
    switch (key) {
      case 'failures':
      case 'pending':
        if (this.lastTest.reporterStats[key] === 0)
          return {
            "background-color": successColor
          }
        else {
          return {
            "background-color": errorColor
          }
        }
        break;

      case 'suites':
      case 'tests':
        return {
          "background-color": neutralColor
        }

      case 'passes':
        if (this.lastTest.reporterStats.passes === this.lastTest.reporterStats.tests) {
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

  getTimeFromLastTest(): string {
    if (this.lastTest === null) {
      return "";
    }
    var one_day = 1000 * 60 * 60 * 24;
    var one_hour = 1000 * 60 * 60;
    var one_minute = 1000 * 60;
    var one_second = 1000 * 60;

    const now: Date = new Date();
    const last: number = Date.parse(this.lastTest.reporterStats.start);
    let milliseconds = now.getTime() - last;
    let days = Math.round(milliseconds / one_day);
    if (days > 0) {
      return `Hace ${days} días`;
    }

    let hours = Math.round(milliseconds / one_hour);
    if (hours > 0) {
      return `Hace aproximadamente ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }

    let minutes = Math.round(milliseconds / one_minute);
    if (minutes > 0) {
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    }

    let seconds = Math.round(milliseconds / one_second);
    return `Hace ${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  }
}
