import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent {
  isOpen = input.required<boolean>();
  title = input.required<string>();
  message = input.required<string>();
  confirmButtonText = input<string>('Confirm');
  confirmButtonClass = input<string>('bg-blue-600 hover:bg-blue-700');
  iconName = input<string>('fas fa-question-circle');
  iconClass = input<string>('text-blue-500');

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
