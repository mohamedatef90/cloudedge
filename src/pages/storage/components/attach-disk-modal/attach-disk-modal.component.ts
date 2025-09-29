import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VirtualMachine } from '../../../virtual-machines/mock-data';

// From storage.component.ts
interface Disk {
  id: string;
  name: string;
  size: number;
  type: 'Standard SSD' | 'High-Performance SSD' | 'Archive HDD';
  attachedTo: string | null;
  creationDate: string;
}

@Component({
  selector: 'app-attach-disk-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './attach-disk-modal.component.html',
  styleUrls: ['./attach-disk-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachDiskModalComponent {
  isOpen = input.required<boolean>();
  diskToAttach = input<Disk | null>();
  availableVms = input<VirtualMachine[]>([]);

  close = output<void>();
  confirmAttach = output<{ diskId: string; vmName: string }>();

  selectedVmName = signal<string>('');

  constructor() {
    effect(() => {
      // Reset selection when modal is opened/closed
      if (!this.isOpen()) {
        this.selectedVmName.set('');
      }
    });
  }

  onConfirm(): void {
    const disk = this.diskToAttach();
    const vmName = this.selectedVmName();
    if (disk && vmName) {
      this.confirmAttach.emit({ diskId: disk.id, vmName: vmName });
    }
  }
}