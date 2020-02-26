import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  TemplateCellRendererComponent,
  TemplateCellRendererParams,
} from './template-cell-renderer.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'host-comp',
  template: `
    <ng-template #tpl>some tpl</ng-template>
    <ng-template #tplValue let-value>value: {{ value }}</ng-template>
    <ng-template #tplValueData let-value let-data="data">
      value: {{ value }}, data: {{ data }}
    </ng-template>
    <mcm-template-cell-renderer></mcm-template-cell-renderer>
  `,
})
class HostComponent {
  @ViewChild('tpl', { static: true })
  tpl?: TemplateRef<any>;
  @ViewChild('tplValue', { static: true })
  tplValue?: TemplateRef<any>;
  @ViewChild('tplValueData', { static: true })
  tplValueData?: TemplateRef<any>;
}

describe('TemplateCellRendererComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let hostComp: HostComponent;
  let componentElem: DebugElement;
  let component: TemplateCellRendererComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateCellRendererComponent, HostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    hostComp = fixture.componentInstance;
    componentElem = fixture.debugElement.query(
      By.directive(TemplateCellRendererComponent),
    );
    component = componentElem.componentInstance;
  });

  it('should render value as is when no template provided', () => {
    component.agInit({
      value: 'my value',
    } as TemplateCellRendererParams);

    fixture.detectChanges();

    expect(componentElem.nativeElement.textContent).toMatch('my value');
  });

  it('should render template with implicit value', () => {
    component.agInit({
      tpl: hostComp.tplValue,
      value: 'my value',
    } as TemplateCellRendererParams);

    fixture.detectChanges();

    expect(componentElem.nativeElement.textContent).toMatch('value: my value');
  });

  it('should render template with implicit value and data', () => {
    component.agInit({
      tpl: hostComp.tplValueData,
      value: 'my value',
      data: 'my data',
    } as TemplateCellRendererParams);

    fixture.detectChanges();

    expect(componentElem.nativeElement.textContent).toMatch(
      'value: my value, data: my data',
    );
  });
});
