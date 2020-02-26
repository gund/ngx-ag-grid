import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface TemplateCellRendererParamsExtra {
  tpl?: TemplateRef<TemplateCellContext>;
  classes?: string | string[] | Record<string, boolean | undefined | null>;
  styles?: Record<string, string>;
}

export interface TemplateCellRendererParams
  extends TemplateCellRendererParamsExtra,
    ICellRendererParams {}

export interface TemplateCellContext<T = unknown>
  extends TemplateCellRendererParams {
  $implicit: T;
}

/**
 * Cell renderer component for AgGrid that allows to render Angular`s template inside.
 *
 * It expects that a {@link TemplateRef} will be set in ColumnDef in parameters for renderer.
 *
 * @see TemplateCellRendererParams
 */
@Component({
  selector: 'nag-template-cell-renderer',
  template: `
    <ng-container
      *ngTemplateOutlet="tpl || fallbackTpl; context: ctx"
    ></ng-container>
    <ng-template #fallbackTpl let-value>{{ value }}</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TemplateCellRendererComponent implements AgRendererComponent {
  tpl?: TemplateRef<TemplateCellContext>;
  ctx: TemplateCellContext | null = null;

  @HostBinding('class') classes?: TemplateCellRendererParams['classes'];
  @HostBinding('style') styles?: TemplateCellRendererParams['styles'];

  agInit(params: TemplateCellRendererParams): void {
    this.updateTpl(params);
  }

  refresh(params: TemplateCellRendererParams): boolean {
    this.updateTpl(params);
    return true;
  }

  private updateTpl(params: TemplateCellRendererParams) {
    this.tpl = params.tpl;
    this.ctx = { ...params, $implicit: params.value };
    this.classes = params.classes;
    this.styles = params.styles;
  }
}
