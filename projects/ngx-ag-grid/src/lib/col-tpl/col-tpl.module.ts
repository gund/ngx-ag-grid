import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ColTplDirective } from './col-tpl.directive';

@NgModule({
  imports: [CommonModule],
  exports: [ColTplDirective],
  declarations: [ColTplDirective],
})
export class ColTplModule {}
