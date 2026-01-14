import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VirtualMachine } from '../../../virtual-machines/mock-data';

// Using the Disk interface from storage component
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
  selector: 'app-create-snapshot-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './create-snapshot-modal.component.html',
  styleUrls: ['./create-snapshot-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSnapshotModalComponent {
  isOpen = input.required<boolean>();
  availableVms = input<VirtualMachine[]>([]);
  allDisks = input<Disk[]>([]);

  close = output<void>();
  create = output<{ disk: Disk; snapshotName: string }>();

  selectedVmName = signal<string | null>(null);
  selectedDiskId = signal<string | null>(null);
  snapshotName = signal('');
  
  disksOfSelectedVm = computed(() => {
    const vmName = this.selectedVmName();
    if (!vmName) return [];
    return this.allDisks().filter(disk => disk.attachedTo === vmName);
  });

  constructor() {
    effect(() => {
      // Reset when modal opens or VM selection changes
      this.isOpen();
      this.selectedVmName();
      this.selectedDiskId.set(null);
      this.snapshotName.set('');
    });
  }

  onSave(): void {
    const diskId = this.selectedDiskId();
    const name = this.snapshotName();
    if (diskId && name.trim()) {
      const disk = this.allDisks().find(d => d.id === diskId);
      if (disk) {
        this.create.emit({ disk, snapshotName: name });
      }
    }
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
