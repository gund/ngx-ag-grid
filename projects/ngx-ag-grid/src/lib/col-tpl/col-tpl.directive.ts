import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  Host,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import { AgGridAngular, AgGridColumn } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { merge, Subject } from 'rxjs';
import { delay, startWith, switchMapTo, takeUntil } from 'rxjs/operators';

import {
  TemplateCellContext,
  TemplateCellRendererComponent,
  TemplateCellRendererParamsExtra,
} from '../template-cell-renderer';
import { Logger } from '../util/logger';
import { LOGGER_TOKEN } from '../util/logger-token';
import { SafeIntersection } from '../util/types';

export interface ColTplCellRendererParams
  extends SafeIntersection<
    [TemplateCellRendererParamsExtra, ColDef['cellRendererParams']]
  > {}

export interface ColTplColDef extends ColDef {
  cellRendererParams: ColTplCellRendererParams;
}

/**
 * Allows to map {@link TemplateRef} to AgGrid column.
 *
 * It automatically sets {@link TemplateCellRendererComponent} as a `cellRendererFramework`
 * for the specified column with required {@link TemplateCellRendererParamsExtra}.
 *
 * **Example with colIds:**
 * ```html
 *  <ag-grid-angular
 *    [columnDefs]="[{colId: 'col1'}, {colId: 'col2'}]">
 *    <span *nagColTpl="'col1'; let value">Col1 is {{ value }}</span>
 *    <span *nagColTpl="'col2'; let value">Col2 is {{ value }}</span>
 *  </ag-grid-angular>
 * ```
 *
 * **Example with {@link AgGridColumn}s:**
 * ```html
 *  <ag-grid-angular>
 *    <ag-grid-column colId="col1">
 *      <span *nagColTpl="let value">Col1 is {{ value }}</span>
 *    </ag-grid-column>
 *    <ag-grid-column colId="col2">
 *      <span *nagColTpl="let value">Col2 is {{ value }}</span>
 *    </ag-grid-column>
 *  </ag-grid-angular>
 * ```
 *
 * **Example with row access:**
 * ```html
 *  <ag-grid-angular
 *    [columnDefs]="[{colId: 'col1'}, {colId: 'col2'}]">
 *    <span *nagColTpl="'col1'; let value; let data='data'">
 *      Col1 is {{ value }}
 *      Col2 is {{ data.col2 }}
 *    </span>
 *  </ag-grid-angular>
 * ```
 *
 * **Example with custom class and style:**
 * ```html
 *  <ag-grid-angular
 *    [columnDefs]="[{colId: 'col1'}, {colId: 'col2'}]">
 *    <span *nagColTpl="'col1'; class: 'custom-class'; style: {'width.px': 20}; let value;">
 *      Col1 is {{ value }}
 *    </span>
 *  </ag-grid-angular>
 * ```
 *
 * Set template on subpath (ex. filterParams) of column config:
 * ```html
 *  <ag-grid-angular
 *    [columnDefs]="[{field: 'col1'}, {field: 'col2'}]">
 *    <span *nagColTpl="col1; path: 'filterParams'">Template for 'col1' filter!</span>
 *  </ag-grid-angular>
 * ```
 *
 * Set template on subpaths of column config:
 * ```html
 *  <ag-grid-angular
 *    [columnDefs]="[{field: 'col1'}, {field: 'col2'}]">
 *    <span *nagColTpl="col1; paths: ['filterParams','sortParams']">
 *      Template for 'col1' filter and sorting!
 *    </span>
 *  </ag-grid-angular>
 * ```
 */
@Directive({ selector: '[nagColTpl]' })
export class ColTplDirective
  implements OnInit, OnChanges, OnDestroy, AfterContentInit {
  /**
   * Column ID to apply template to.
   * If applied within {@link AgGridColumn} - then it's ignored and parent column id is used.
   */
  @Input() nagColTpl?: string;
  /**
   * Class to apply to the template.
   * Supports syntax of {@link import('@angular/common').NgClass} directive.
   */
  @Input() nagColTplClass?: TemplateCellRendererParamsExtra['classes'];
  /**
   * Styles to apply to the template.
   * Supports only simple syntax of {@link import('@angular/common').NgStyle} directive
   * where keys can be only CSS property names and values are strings with required units.
   */
  @Input() nagColTplStyle?: TemplateCellRendererParamsExtra['styles'];
  /**
   * Applies the template with params to the sub path on {@link ColDef}
   */
  @Input() nagColTplPath?: string;
  /**
   * Applies the template with params to a multiple sub paths on {@link ColDef}
   */
  @Input() nagColTplPaths?: string[];

  private destroyed$ = new Subject<void>();
  private contentInit$ = new Subject<void>();
  private update$ = new Subject<void>();

  private init$ = merge(this.contentInit$, this.grid.gridReady).pipe(delay(0));
  private updating$ = this.init$.pipe(
    switchMapTo(this.update$.pipe(startWith(null))),
  );

  private paths: string[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(LOGGER_TOKEN) private logger: Logger,
    @Host() private tplRef: TemplateRef<TemplateCellContext>,
    @SkipSelf() private grid: AgGridAngular,
    @SkipSelf() @Optional() private column: AgGridColumn,
  ) {}

  ngOnInit(): void {
    this.updating$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.updateColParams());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('nagColTplPath' in changes || 'nagColTplPaths' in changes) {
      this.updatePaths();
    }

    if ('nagColTpl' in changes) {
      this.update$.next();
    }
  }

  ngAfterContentInit(): void {
    this.contentInit$.next();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private updateColParams() {
    if (!this.grid.columnApi) {
      return;
    }

    const colId: string = this.column ? this.column.colId : this.nagColTpl;
    const col = this.grid.columnApi.getColumn(colId);

    if (!col) {
      this.logger.warn(
        `ColTplDirective: Unable to set template for column '${colId}' as it's NOT found in table`,
      );
      return;
    }

    const colDef = col.getColDef() as ColTplColDef;

    if (this.paths.length) {
      this.paths
        .map(subPath => subPath.split('.'))
        .map(path => path.reduce((obj, p) => obj && (obj as any)[p], colDef))
        .filter(obj => !!obj)
        .forEach(obj => this.setTplOn(obj));
    } else {
      this.setTplOn(colDef);
    }

    this.cdr.markForCheck();
  }

  private setTplOn(colDef: ColTplColDef) {
    colDef.cellRendererFramework = TemplateCellRendererComponent;
    colDef.cellRendererParams = colDef.cellRendererParams || {};
    colDef.cellRendererParams.tpl = this.tplRef;
    colDef.cellRendererParams.classes = this.nagColTplClass;
    colDef.cellRendererParams.styles = this.nagColTplStyle;
  }

  private updatePaths() {
    const paths = [];

    if (this.nagColTplPath) {
      paths.push(this.nagColTplPath);
    }

    if (this.nagColTplPaths) {
      paths.push.apply(paths, this.nagColTplPaths);
    }

    this.paths = paths;
  }
}
