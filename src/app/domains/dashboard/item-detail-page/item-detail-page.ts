import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-item-detail-page',
  imports: [],
  templateUrl: './item-detail-page.html',
  styleUrl: './item-detail-page.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailPage {

}
