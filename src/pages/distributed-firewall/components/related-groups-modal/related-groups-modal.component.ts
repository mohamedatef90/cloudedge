import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import { SelectableGroup } from '../../types';

@Component({
  selector: 'app-related-groups-modal',
  templateUrl: './related-groups-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class RelatedGroupsModalComponent {
  isOpen = input.required<boolean>();
  group = input<SelectableGroup | null>();
  close = output<void>();
}
