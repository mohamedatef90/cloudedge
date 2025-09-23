
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbItem } from '../../types';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, IconComponent],
})
export class BreadcrumbsComponent {
  items = input.required<BreadcrumbItem[]>();
}
