import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TemplateCellRendererComponent } from './template-cell-renderer.component';

@NgModule({
  imports: [CommonModule],
  exports: [TemplateCellRendererComponent],
  declarations: [TemplateCellRendererComponent],
})
export class TemplateCellRendererModule {}
