import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../../components/icon/icon.component';
import { Disk } from '../add-edit-disk-modal/add-edit-disk-modal.component';

@Component({
  selector: 'app-delete-disk-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './delete-disk-confirmation-modal.component.html',
  styleUrls: ['./delete-disk-confirmation-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDiskConfirmationModalComponent {
  isOpen = input.required<boolean>();
  disk = input<Disk | null>();

  close = output<void>();
  confirm = output<void>();

  confirmationText = signal('');

  isConfirmed = computed(() => this.confirmationText() === this.disk()?.name);

  constructor() {
    effect(() => {
      // Reset confirmation text when modal is closed
      if (!this.isOpen()) {
        this.confirmationText.set('');
      }
    });
  }
  
  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (this.isConfirmed()) {
      this.confirm.emit();
    }
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
