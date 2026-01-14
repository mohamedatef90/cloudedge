

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
  diskNumber: number | null;
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
  allDisks = input<Disk[]>([]);

  close = output<void>();
  confirmAttach = output<{ diskId: string; vmName: string; diskNumber: number | null }>();

  selectedVmName = signal<string>('');
  selectedDiskNumber = signal<number | null>(null);

  availableDiskNumbers = computed(() => {
    const vmName = this.selectedVmName();
    if (!vmName) {
        return [];
    }
    const usedDiskNumbers = this.allDisks()
        .filter(d => d.attachedTo === vmName && d.diskNumber !== null)
        .map(d => d.diskNumber as number)
        .sort((a, b) => a - b);
    
    const available: number[] = [];
    let nextNumber = 0;
    while (available.length < 16) { // Offer up to 16 slots
        if (!usedDiskNumbers.includes(nextNumber)) {
            available.push(nextNumber);
        }
        nextNumber++;
        if (nextNumber > 100) break; // safety break
    }
    return available;
  });

  constructor() {
    effect(() => {
      // Reset selection when modal is opened/closed or VM changes
      this.isOpen();
      this.selectedVmName();
      this.selectedDiskNumber.set(null);
    });
  }

  onConfirm(): void {
    const disk = this.diskToAttach();
    const vmName = this.selectedVmName();
    if (disk && vmName) {
      this.confirmAttach.emit({ diskId: disk.id, vmName: vmName, diskNumber: this.selectedDiskNumber() });
    }
  }
}