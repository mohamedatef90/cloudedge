import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';

// Match the main component's interface
interface Disk {
  id: string;
  name: string;
  size: number;
  type: 'Standard SSD' | 'High-Performance SSD' | 'Archive HDD';
  attachedTo: string | null;
  creationDate: string;
}

@Component({
  selector: 'app-delete-disk-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './delete-disk-modal.component.html',
  styleUrls: ['./delete-disk-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDiskModalComponent {
  isOpen = input.required<boolean>();
  diskToDelete = input<Disk | null>();

  close = output<void>();
  confirm = output<void>();
}
