import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import { FirewallGroup } from '../../firewall-groups.component';

@Component({
  selector: 'app-delete-group-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './delete-group-modal.component.html',
  styleUrls: ['./delete-group-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteGroupModalComponent {
  isOpen = input.required<boolean>();
  groupToDelete = input<FirewallGroup | null>();
  
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
