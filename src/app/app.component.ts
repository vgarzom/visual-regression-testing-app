import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;

  constructor(private modalService: NzModalService) { }

  showConfirm(): void {
    let r = this.modalService.confirm({
      nzTitle: 'Iniciar prueba',
      nzContent: 'Una vez inicia la prueba no puede ser cancelada o detenida. ¿Deseas continuar?',
      nzOkText: 'Si',
      nzCancelText: 'No',
      nzOnOk: this.initTest
    });

  }

  initTest(): void {
    console.log("starting test");
  }
}
