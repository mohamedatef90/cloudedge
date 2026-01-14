


import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { CreateEditDiskModalComponent, DiskFormData } from './components/create-edit-disk-modal/create-edit-disk-modal.component';
import { AttachDiskModalComponent } from './components/attach-disk-modal/attach-disk-modal.component';
import { VirtualMachine, VIRTUAL_MACHINES_DATA } from '../virtual-machines/mock-data';
import { CreateSnapshotModalComponent } from './components/create-snapshot-modal/create-snapshot-modal.component';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

// --- Interfaces for Storage Page ---

export interface Disk {
  id: string;
  name: string;
  size: number; // in GB
  type: 'Standard SSD' | 'High-Performance SSD' | 'Archive HDD';
  attachedTo: string | null;
  diskNumber: number | null;
  creationDate: string;
}

interface Bucket {
  id: string;
  name: string;
  region: string;
  accessLevel: 'Private' | 'Public';
}

export interface Snapshot {
  id: string;
  name: string;
  sourceDisk: string;
  size: number; // in GB
  creationTime: string;
}

type StorageTab = 'disks' | 'objectStorage' | 'snapshots';
type SortableDiskKeys = 'name' | 'size' | 'type' | 'attachedTo' | 'creationDate' | 'diskNumber';
type SortableSnapshotKeys = 'name' | 'sourceDisk' | 'size' | 'creationTime';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, CreateEditDiskModalComponent, AttachDiskModalComponent, CreateSnapshotModalComponent, AdvancedDeleteConfirmationModalComponent, ConfirmationModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class StorageComponent {
  activeTab = signal<StorageTab>('disks');
  openActionMenuId = signal<string | null>(null);

  // --- Modal State ---
  isCreateDiskModalOpen = signal(false);
  diskToEdit = signal<Disk | null>(null);
  isDeleteDiskModalOpen = signal(false);
  diskToDelete = signal<Disk | null>(null);
  isAttachDiskModalOpen = signal(false);
  diskToAttach = signal<Disk | null>(null);
  isCreateSnapshotModalOpen = signal(false);
  
  // --- Detach Confirmation Modal ---
  isDetachConfirmModalOpen = signal(false);
  diskToDetach = signal<Disk | null>(null);
  detachConfirmModalConfig = signal({
      title: '',
      message: '',
      confirmButtonText: '',
      confirmButtonClass: '',
      iconName: '',
      iconClass: ''
  });
  
  // --- Snapshot Deletion State ---
  isDeleteSnapshotModalOpen = signal(false);
  snapshotToDelete = signal<Snapshot | null>(null);

  availableVms = signal<VirtualMachine[]>(VIRTUAL_MACHINES_DATA);

  // --- Snapshot Hint State ---
  showSnapshotHint = signal(false);

  // --- Disks Tab State ---
  disksSearchTerm = signal('');
  disksSortColumn = signal<SortableDiskKeys>('name');
  disksSortDirection = signal<'asc' | 'desc'>('asc');

  disks = signal<Disk[]>([
    { id: 'disk-1', name: 'prod-web-server-os', size: 100, type: 'High-Performance SSD', attachedTo: 'prod-web-server-01', diskNumber: 0, creationDate: '2023-05-10' },
    { id: 'disk-7', name: 'prod-web-server-data', size: 250, type: 'Standard SSD', attachedTo: 'prod-web-server-01', diskNumber: 1, creationDate: '2023-11-15' },
    { id: 'disk-2', name: 'sql-database-data', size: 500, type: 'High-Performance SSD', attachedTo: 'sql-database-main', diskNumber: 0, creationDate: '2023-03-22' },
    { id: 'disk-3', name: 'dev-env-main-disk', size: 50, type: 'Standard SSD', attachedTo: 'dev-environment-centos', diskNumber: 0, creationDate: '2023-08-01' },
    { id: 'disk-4', name: 'k8s-worker-storage', size: 200, type: 'Standard SSD', attachedTo: 'k8s-worker-node-a', diskNumber: 0, creationDate: '2023-09-15' },
    { id: 'disk-5', name: 'archived-logs-q3', size: 1000, type: 'Archive HDD', attachedTo: null, diskNumber: null, creationDate: '2023-10-01' },
    { id: 'disk-6', name: 'ad-dc-backup', size: 150, type: 'Standard SSD', attachedTo: 'AD-Domain-Controller', diskNumber: 0, creationDate: '2022-11-30' },
  ]);

  // --- Capacity Overview ---
  totalCapacity = signal(10240); // 10 TB in GB
  totalProvisionedStorage = computed(() => this.disks().reduce((total, disk) => total + disk.size, 0));
  
  provisionedPercentage = computed(() => {
    return (this.totalProvisionedStorage() / this.totalCapacity()) * 100;
  });

  availableStorage = computed(() => this.totalCapacity() - this.totalProvisionedStorage());

  filteredDisks = computed(() => {
    const term = this.disksSearchTerm().toLowerCase();
    const column = this.disksSortColumn();
    const direction = this.disksSortDirection();
    
    const filtered = this.disks().filter(disk => 
      disk.name.toLowerCase().includes(term) ||
      (disk.attachedTo && disk.attachedTo.toLowerCase().includes(term))
    );

    return [...filtered].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = (aValue ?? '').localeCompare(bValue ?? '');
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = (aValue ?? 0) - (bValue ?? 0);
      } else {
        // Handle nulls and other types
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  });

  // --- Object Storage Tab State ---
  buckets = signal<Bucket[]>([
    { id: 'bucket-1', name: 'website-static-assets', region: 'us-east-1', accessLevel: 'Public' },
    { id: 'bucket-2', name: 'database-backups-private', region: 'us-west-2', accessLevel: 'Private' },
    { id: 'bucket-3', name: 'application-logs', region: 'eu-central-1', accessLevel: 'Private' },
  ]);

  // --- Snapshots Tab State ---
  snapshotsSearchTerm = signal('');
  snapshotsSortColumn = signal<SortableSnapshotKeys>('creationTime');
  snapshotsSortDirection = signal<'asc' | 'desc'>('desc');

  snapshots = signal<Snapshot[]>([
    { id: 'snap-1', name: 'prod-web-os-pre-patch', sourceDisk: 'prod-web-server-os', size: 100, creationTime: '2023-10-26T10:00:00Z' },
    { id: 'snap-2', name: 'sql-db-weekly-backup', sourceDisk: 'sql-database-data', size: 500, creationTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'snap-3', name: 'dev-env-before-upgrade', sourceDisk: 'dev-env-main-disk', size: 50, creationTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  ]);
  
  filteredSnapshots = computed(() => {
    const term = this.snapshotsSearchTerm().toLowerCase();
    const column = this.snapshotsSortColumn();
    const direction = this.snapshotsSortDirection();
    
    const filtered = this.snapshots().filter(snap => 
      snap.name.toLowerCase().includes(term) ||
      snap.sourceDisk.toLowerCase().includes(term)
    );

    return [...filtered].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = (aValue as number) - (bValue as number);
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  });

  onGlobalClick(target: HTMLElement): void {
    if (!target.closest('.action-menu-container')) {
      this.openActionMenuId.set(null);
    }
  }

  setActiveTab(tab: StorageTab): void {
    this.activeTab.set(tab);
    this.openActionMenuId.set(null);
  }
  
  toggleActionMenu(id: string): void {
    this.openActionMenuId.update(currentId => (currentId === id ? null : id));
  }

  setDisksSort(column: SortableDiskKeys): void {
    if (this.disksSortColumn() === column) {
      this.disksSortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.disksSortColumn.set(column);
      this.disksSortDirection.set('asc');
    }
  }
  
  setSnapshotsSort(column: SortableSnapshotKeys): void {
    if (this.snapshotsSortColumn() === column) {
      this.snapshotsSortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.snapshotsSortColumn.set(column);
      this.snapshotsSortDirection.set('desc');
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  isSnapshotOld(snapshot: Snapshot): boolean {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(snapshot.creationTime) < threeDaysAgo;
  }

  openCreateSnapshotModal(): void {
    this.isCreateSnapshotModalOpen.set(true);
  }

  // --- Disk Actions ---

  openCreateDiskModal(): void {
    this.diskToEdit.set(null);
    this.isCreateDiskModalOpen.set(true);
  }

  openEditDiskModal(disk: Disk): void {
    this.diskToEdit.set(disk);
    this.isCreateDiskModalOpen.set(true);
  }

  closeDiskModal(): void {
    this.isCreateDiskModalOpen.set(false);
    this.diskToEdit.set(null);
  }

  handleSaveDisk(diskData: DiskFormData): void {
    if (this.diskToEdit()) {
      // Update (Resize)
      this.disks.update(disks => 
        disks.map(d => d.id === this.diskToEdit()!.id ? { ...d, size: diskData.size } : d)
      );
    } else {
      // Create
      const newDisk: Disk = {
        id: `disk-${Date.now()}`,
        name: diskData.name,
        size: diskData.size,
        type: diskData.type,
        attachedTo: diskData.attachedTo,
        diskNumber: diskData.diskNumber,
        creationDate: new Date().toISOString().split('T')[0],
      };
      this.disks.update(disks => [newDisk, ...disks]);
    }
    this.closeDiskModal();
  }

  handleCreateSnapshot(disk: Disk): void {
    const snapshotName = prompt(`Enter a name for the snapshot of "${disk.name}":`, `${disk.name}-snapshot-${new Date().toISOString().slice(0, 10)}`);
    if (!snapshotName) return;

    const newSnapshot: Snapshot = {
      id: `snap-${Date.now()}`,
      name: snapshotName,
      sourceDisk: disk.name,
      size: disk.size,
      creationTime: new Date().toISOString(),
    };
    this.snapshots.update(snaps => [newSnapshot, ...snaps]);
    this.setActiveTab('snapshots');
    this.closeActionMenu();
  }

  handleCreateSnapshotFromModal(event: { disk: Disk, snapshotName: string }): void {
    const { disk, snapshotName } = event;
    if (!snapshotName) return;

    const newSnapshot: Snapshot = {
      id: `snap-${Date.now()}`,
      name: snapshotName,
      sourceDisk: disk.name,
      size: disk.size,
      creationTime: new Date().toISOString(),
    };
    this.snapshots.update(snaps => [newSnapshot, ...snaps]);
    this.isCreateSnapshotModalOpen.set(false);
  }

  openAttachDiskModal(disk: Disk): void {
    this.diskToAttach.set(disk);
    this.isAttachDiskModalOpen.set(true);
    this.closeActionMenu();
  }
  
  closeAttachDiskModal(): void {
    this.isAttachDiskModalOpen.set(false);
    this.diskToAttach.set(null);
  }
  
  handleConfirmAttach(event: { diskId: string; vmName: string; diskNumber: number | null }): void {
    if (event.diskNumber === null) {
      alert('Please select a disk number.');
      return;
    }
    this.disks.update(disks => 
      disks.map(d => d.id === event.diskId ? { ...d, attachedTo: event.vmName, diskNumber: event.diskNumber } : d)
    );
    this.closeAttachDiskModal();
  }

  handleDetachDisk(disk: Disk): void {
    this.diskToDetach.set(disk);
    
    let config;
    if (disk.diskNumber === 0) {
      config = {
        title: `Detach OS Disk?`,
        message: `You are about to detach the primary OS disk (Disk 0) from <strong>${disk.attachedTo}</strong>. This will likely make the virtual machine unbootable. Are you sure you want to proceed?`,
        confirmButtonText: 'Detach Anyway',
        confirmButtonClass: 'bg-orange-600 hover:bg-orange-700',
        iconName: 'fas fa-exclamation-triangle',
        iconClass: 'text-orange-500'
      };
    } else {
      config = {
        title: `Detach Disk`,
        message: `Are you sure you want to detach the disk <strong>${disk.name}</strong> from <strong>${disk.attachedTo}</strong>?`,
        confirmButtonText: 'Detach',
        confirmButtonClass: 'bg-red-600 hover:bg-red-700',
        iconName: 'fas fa-unlink',
        iconClass: 'text-red-500'
      };
    }
    
    this.detachConfirmModalConfig.set(config);
    this.isDetachConfirmModalOpen.set(true);
    this.closeActionMenu();
  }

  onCloseDetachConfirmModal(): void {
    this.isDetachConfirmModalOpen.set(false);
    this.diskToDetach.set(null);
  }

  onConfirmDetach(): void {
    const disk = this.diskToDetach();
    if (disk) {
      this.disks.update(disks =>
        disks.map(d => d.id === disk.id ? { ...d, attachedTo: null, diskNumber: null } : d)
      );
    }
    this.onCloseDetachConfirmModal();
  }

  openDeleteDiskModal(disk: Disk): void {
    this.diskToDelete.set(disk);
    this.isDeleteDiskModalOpen.set(true);
    this.closeActionMenu();
  }

  closeDeleteDiskModal(): void {
    this.isDeleteDiskModalOpen.set(false);
    this.diskToDelete.set(null);
  }

  handleConfirmDelete(): void {
    const diskIdToDelete = this.diskToDelete()?.id;
    if (diskIdToDelete) {
      this.disks.update(disks => disks.filter(d => d.id !== diskIdToDelete));
    }
    this.closeDeleteDiskModal();
  }
  
  // --- Snapshot Actions ---

  openDeleteSnapshotModal(snapshot: Snapshot): void {
    this.snapshotToDelete.set(snapshot);
    this.isDeleteSnapshotModalOpen.set(true);
    this.closeActionMenu();
  }

  closeDeleteSnapshotModal(): void {
    this.isDeleteSnapshotModalOpen.set(false);
    this.snapshotToDelete.set(null);
  }

  handleConfirmSnapshotDelete(): void {
    const snapshotIdToDelete = this.snapshotToDelete()?.id;
    if (snapshotIdToDelete) {
      this.snapshots.update(snapshots => snapshots.filter(s => s.id !== snapshotIdToDelete));
    }
    this.closeDeleteSnapshotModal();
  }

  private closeActionMenu(): void {
    this.openActionMenuId.set(null);
  }
}
