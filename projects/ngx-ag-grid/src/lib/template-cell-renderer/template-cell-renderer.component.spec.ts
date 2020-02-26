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
    <nag-template-cell-renderer></nag-template-cell-renderer>
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

    hostComp = fixture.componentInstance;
    componentElem = fixture.debugElement.query(
      By.directive(TemplateCellRendererComponent),
    );
    component = componentElem.componentInstance;
  });

  it('should render value as is when no template provided', () => {
    component.agInit(createParams({ value: 'my value' }));

    fixture.detectChanges();

    expect(componentElem.nativeElement.textContent).toMatch('my value');
  });

  it('should render template with implicit value', () => {
    component.agInit(
      createParams({
        tpl: hostComp.tplValue,
        value: 'my value',
      }),
    );

    fixture.detectChanges();

    expect(componentElem.nativeElement.textContent).toMatch('value: my value');
  });

  it('should render template with implicit value and data', () => {
    component.agInit(
      createParams({
        tpl: hostComp.tplValueData,
        value: 'my value',
        data: 'my data',
      }),
    );

    fixture.detectChanges();

    expect(componentElem.nativeElement.textContent).toMatch(
      'value: my value, data: my data',
    );
  });

  describe('refresh() method', () => {
    it('should call `updateTpl()` with `params`', () => {
      const updateTplSpy = spyOn(component as any, 'updateTpl');
      const params = createParams({});

      component.refresh(params);

      expect(updateTplSpy).toHaveBeenCalledWith(params);
    });
  });

  describe('classes on host', () => {
    it('should set from single string class', () => {
      component.agInit(createParams({ classes: 'cls' }));

      fixture.detectChanges();

      expect(componentElem.classes.cls).toBeTruthy();
    });

    it('should set from array of strings classes', () => {
      component.agInit(createParams({ classes: ['cls1', 'cls2'] }));

      fixture.detectChanges();

      expect(componentElem.classes.cls1).toBeTruthy();
      expect(componentElem.classes.cls2).toBeTruthy();
    });

    it('should set from object of enabled classes', () => {
      component.agInit(createParams({ classes: { cls1: true, cls2: false } }));

      fixture.detectChanges();

      expect(componentElem.classes.cls1).toBeTruthy();
      expect(componentElem.classes.cls2).toBeFalsy();
    });
  });

  describe('styles on host', () => {
    it('should set from object of styles', () => {
      component.agInit(
        createParams({ styles: { display: 'block', width: '20px' } }),
      );

      fixture.detectChanges();

      expect(componentElem.styles.display).toBe('block');
      expect(componentElem.styles.width).toBe('20px');
    });
  });
});

function createParams(
  params: Partial<TemplateCellRendererParams>,
): TemplateCellRendererParams {
  return params as TemplateCellRendererParams;
}
