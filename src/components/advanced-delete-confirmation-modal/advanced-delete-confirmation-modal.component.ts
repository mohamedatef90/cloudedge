import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-advanced-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './advanced-delete-confirmation-modal.component.html',
  styleUrls: ['./advanced-delete-confirmation-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedDeleteConfirmationModalComponent {
  isOpen = input.required<boolean>();
  itemType = input<string>('item');
  itemName = input<string>(''); // For single item deletion
  itemCount = input<number>(1); // For multi-item deletion
  customMessage = input<string | null>(null);

  close = output<void>();
  confirm = output<void>();

  confirmationText = signal('');

  isSingleItem = computed(() => this.itemCount() === 1 && !!this.itemName());

  isConfirmed = computed(() => {
    if (this.isSingleItem()) {
      return this.confirmationText() === this.itemName();
    }
    return this.confirmationText().toUpperCase() === 'DELETE';
  });

  pluralizedItemType = computed(() => {
    if (this.itemCount() === 1) {
      return this.itemType();
    }
    const itemType = this.itemType();
    const lowerItemType = itemType.toLowerCase();
    if (itemType.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(lowerItemType.charAt(lowerItemType.length - 2))) {
        return itemType.slice(0, -1) + 'ies';
    }
    if (itemType.endsWith('s')) {
        return itemType + 'es';
    }
    return itemType + 's';
  });

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