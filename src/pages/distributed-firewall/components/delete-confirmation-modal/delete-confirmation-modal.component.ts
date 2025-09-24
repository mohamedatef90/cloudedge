
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class DeleteConfirmationModalComponent {
  isOpen = input.required<boolean>();
  itemCount = input.required<number>();

  close = output<void>();
  confirm = output<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
