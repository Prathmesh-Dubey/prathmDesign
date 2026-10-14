import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryPageComponent } from '../../shared/category-page.component';
import { CARD_EXAMPLES } from './cards.examples';

@Component({
  selector: 'app-cards-page',
  imports: [CategoryPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-category-page category="cards" [examples]="examples" />`,
})
export default class CardsPage {
  protected readonly examples = CARD_EXAMPLES;
}
