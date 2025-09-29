
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
  creationDate: string;
}

export type DiskFormData = {
  name: string;
  size: number;
  type: 'Standard SSD' | 'High-Performance SSD' | 'Archive HDD';
  attachedTo: string | null;
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

  close = output<void>();
  save = output<DiskFormData>();
  
  diskData = signal<DiskFormData>({
    name: '',
    size: 100,
    type: 'Standard SSD',
    attachedTo: null
  });
  
  isEditMode = computed(() => !!this.diskToEdit());

  diskTypes: DiskFormData['type'][] = ['Standard SSD', 'High-Performance SSD', 'Archive HDD'];

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const disk = this.diskToEdit();
        if (disk) { // Edit mode
          this.diskData.set({ name: disk.name, size: disk.size, type: disk.type, attachedTo: disk.attachedTo });
        } else { // Create mode
          this.diskData.set({ name: '', size: 100, type: 'Standard SSD', attachedTo: null });
        }
      }
    });
  }

  onSave(): void {
    const data = this.diskData();
    if (data.name.trim() && data.size > 0) {
      this.save.emit(data);
    }
  }
}
