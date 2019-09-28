import { NgModule } from '@angular/core';
import { TestListComponent } from './test-list.component';
import { TestListRoutingModule } from './test-list-routing.module';
import { CommonModule } from '@angular/common';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';

@NgModule({
  declarations: [TestListComponent],
  imports: [
    CommonModule,
    TestListRoutingModule,
    NgZorroAntdModule
  ],
  exports: [
    TestListComponent
  ]
})
export class TestListModule { }
