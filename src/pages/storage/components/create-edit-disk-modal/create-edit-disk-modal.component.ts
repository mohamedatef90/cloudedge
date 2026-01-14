

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VirtualMachine } from '../../../virtual-machines/mock-data';

// Match the main component's interface
interface Disk {
  id: string;
  name: string;
  size: number; // in GB
  type: 'Standard SSD' | 'High-Performance SSD' | 'Archive HDD';
  attachedTo: string | null;
  diskNumber: number | null;
  creationDate: string;
}

export type DiskFormData = {
  name: string;
  size: number;
  type: 'Standard SSD' | 'High-Performance SSD' | 'Archive HDD';
  attachedTo: string | null;
  diskNumber: number | null;
};

@Component({
  selector: 'app-create-edit-disk-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './create-edit-disk-modal.component.html',
  styleUrls: ['./create-edit-disk-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditDiskModalComponent {
  isOpen = input.required<boolean>();
  diskToEdit = input<Disk | null>();
  availableStorage = input<number>(0);
  availableVms = input<VirtualMachine[]>([]);
  allDisks = input<Disk[]>([]);

  close = output<void>();
  save = output<DiskFormData>();
  
  diskData = signal<DiskFormData>({
    name: '',
    size: 100,
    type: 'Standard SSD',
    attachedTo: null,
    diskNumber: null,
  });
  
  isEditMode = computed(() => !!this.diskToEdit());

  diskTypes: DiskFormData['type'][] = ['Standard SSD', 'High-Performance SSD', 'Archive HDD'];

  availableDiskNumbers = computed(() => {
    const vmName = this.diskData().attachedTo;
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
      if (this.isOpen()) {
        const disk = this.diskToEdit();
        if (disk) { // Edit mode
          this.diskData.set({ name: disk.name, size: disk.size, type: disk.type, attachedTo: disk.attachedTo, diskNumber: disk.diskNumber });
        } else { // Create mode
          this.diskData.set({ name: '', size: 100, type: 'Standard SSD', attachedTo: null, diskNumber: null });
        }
      }
    });

    effect(() => {
        // When attachedTo VM changes, if the current disk number is no longer available, reset it.
        const currentDiskNumber = this.diskData().diskNumber;
        const available = this.availableDiskNumbers();
        if (currentDiskNumber !== null && !available.includes(currentDiskNumber)) {
            this.diskData.update(d => ({ ...d, diskNumber: null }));
        }
    });
  }

  onSave(): void {
    const data = this.diskData();
    if (data.name.trim() && data.size > 0) {
      if (data.attachedTo && data.diskNumber === null) {
        alert('Please select a disk number.');
        return;
      }
      this.save.emit(data);
    }
  }
}