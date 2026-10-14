import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryPageComponent } from '../../shared/category-page.component';
import { HERO_EXAMPLES } from './heroes.examples';

@Component({
  selector: 'app-heroes-page',
  imports: [CategoryPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-category-page category="heroes" [examples]="examples" />`,
})
export default class HeroesPage {
  protected readonly examples = HERO_EXAMPLES;
}
