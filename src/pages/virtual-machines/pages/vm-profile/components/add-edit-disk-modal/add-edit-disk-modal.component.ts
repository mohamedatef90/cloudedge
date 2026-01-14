

import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../../components/icon/icon.component';

export interface Disk {
  id: string;
  name: string;
  sizeGB: number;
  type: 'SSD' | 'HDD';
  diskNumber?: number;
}

@Component({
  selector: 'app-add-edit-disk-modal',
  templateUrl: './add-edit-disk-modal.component.html',
  styleUrls: ['./add-edit-disk-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class AddEditDiskModalComponent {
  isOpen = input.required<boolean>();
  diskToEdit = input<Disk | null>();
  availableStorage = input<number>(0);
  availableDiskNumbers = input<number[]>([]);

  close = output<void>();
  save = output<Disk>();

  diskData = signal<{ name: string; sizeGB: number; type: 'SSD' | 'HDD', diskNumber: number | null }>({ name: '', sizeGB: 100, type: 'SSD', diskNumber: null });
  
  isEditMode = computed(() => !!this.diskToEdit());

  constructor() {
    effect(() => {
      const disk = this.diskToEdit();
      if (this.isOpen()) {
        if (disk) {
          this.diskData.set({ name: disk.name, sizeGB: disk.sizeGB, type: disk.type, diskNumber: disk.diskNumber ?? null });
        } else {
          this.diskData.set({ name: '', sizeGB: 100, type: 'SSD', diskNumber: null });
        }
      }
    });
  }

  onSave(): void {
    const data = this.diskData();
    if (data.name.trim() && data.sizeGB > 0) {
      if (!this.isEditMode() && data.diskNumber === null) {
        alert('Please select a disk number.');
        return;
      }
      const outputData: Disk = {
        id: this.diskToEdit()?.id || `disk-${Date.now()}`,
        name: data.name,
        sizeGB: data.sizeGB,
        type: data.type,
        diskNumber: this.isEditMode() ? this.diskToEdit()?.diskNumber : data.diskNumber ?? undefined,
      };
      this.save.emit(outputData);
    }
  }
}