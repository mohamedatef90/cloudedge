import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { Service } from '../../firewall-services.component';

@Component({
  selector: 'app-where-used-modal',
  templateUrl: './where-used-modal.component.html',
  styleUrls: ['./where-used-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
  standalone: true,
})
export class WhereUsedModalComponent {
  isOpen = input.required<boolean>();
  service = input<Service | null>();
  close = output<void>();

  searchTerm = signal('');

  onClose(): void {
    this.searchTerm.set('');
    this.close.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
