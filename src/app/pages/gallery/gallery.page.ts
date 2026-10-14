import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryPageComponent } from '../../shared/category-page.component';
import { GALLERY_EXAMPLES } from './gallery.examples';

@Component({
  selector: 'app-gallery-page',
  imports: [CategoryPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-category-page category="gallery" [examples]="examples" />`,
})
export default class GalleryPage {
  protected readonly examples = GALLERY_EXAMPLES;
}
