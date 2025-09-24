import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import { Draft } from '../../types';

@Component({
  selector: 'app-delete-draft-modal',
  templateUrl: './delete-draft-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class DeleteDraftModalComponent {
  isOpen = input.required<boolean>();
  draft = input<Draft | null>();
  close = output<void>();
  confirm = output<void>();
}
