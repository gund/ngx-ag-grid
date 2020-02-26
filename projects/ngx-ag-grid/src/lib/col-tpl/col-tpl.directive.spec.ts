import { Component, EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AgGridAngular } from 'ag-grid-angular';

import { ColTplDirective } from './col-tpl.directive';

class MockAgGrid {
  gridReady = new EventEmitter<any>();
  columnApi = {
    getColumn: jasmine.createSpy(),
  };
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'host-comp',
  template: `
    <ng-template [nagColTpl]="col"></ng-template>
  `,
})
class HostComponent {
  col?: string;
}

describe('ColTplDirective', () => {
  let mockGrid: MockAgGrid;

  beforeEach(() => {
    mockGrid = new MockAgGrid();

    TestBed.configureTestingModule({
      declarations: [ColTplDirective, HostComponent],
      providers: [{ provide: AgGridAngular, useValue: mockGrid }],
    });
  });
});
