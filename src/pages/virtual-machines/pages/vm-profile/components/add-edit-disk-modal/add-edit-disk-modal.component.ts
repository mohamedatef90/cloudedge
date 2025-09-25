
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../../components/icon/icon.component';

export interface Disk {
  id: string;
  name: string;
  sizeGB: number;
  type: 'SSD' | 'HDD';
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

  close = output<void>();
  save = output<Disk>();

  diskData = signal<Omit<Disk, 'id'>>({ name: '', sizeGB: 100, type: 'SSD' });
  
  isEditMode = computed(() => !!this.diskToEdit());

  constructor() {
    effect(() => {
      const disk = this.diskToEdit();
      if (this.isOpen() && disk) {
        this.diskData.set({ name: disk.name, sizeGB: disk.sizeGB, type: disk.type });
      } else {
        this.diskData.set({ name: '', sizeGB: 100, type: 'SSD' });
      }
    });
  }

  onSave(): void {
    const data = this.diskData();
    if (data.name.trim() && data.sizeGB > 0) {
      const outputData: Disk = {
        id: this.diskToEdit()?.id || `disk-${Date.now()}`,
        ...data
      };
      this.save.emit(outputData);
    }
  }
}
