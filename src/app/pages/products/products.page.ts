import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryPageComponent } from '../../shared/category-page.component';
import { PRODUCT_EXAMPLES } from './products.examples';

@Component({
  selector: 'app-products-page',
  imports: [CategoryPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-category-page category="products" [examples]="examples" />`,
})
export default class ProductsPage {
  protected readonly examples = PRODUCT_EXAMPLES;
}
