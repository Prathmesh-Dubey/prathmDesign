import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryPageComponent } from '../../shared/category-page.component';
import { TYPOGRAPHY_EXAMPLES } from './typography.examples';

@Component({
  selector: 'app-typography-page',
  imports: [CategoryPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-category-page category="typography" [examples]="examples" />`,
})
export default class TypographyPage {
  protected readonly examples = TYPOGRAPHY_EXAMPLES;
}
