
import { ChangeDetectionStrategy, Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VirtualMachine, VIRTUAL_MACHINES_DATA } from '../../mock-data';
import { AddEditDiskModalComponent, Disk } from './components/add-edit-disk-modal/add-edit-disk-modal.component';
import { AddEditGatewayModalComponent, GatewayInfo } from './components/add-edit-gateway-modal/add-edit-gateway-modal.component';


// Define local interfaces for the tabs
// Disk is now imported
// GatewayInfo is now imported
interface Snapshot {
  id: string;
  name: string;
  creationDate: string;
  description: string;
}

@Component({
  selector: 'app-vm-profile',
  templateUrl: './vm-profile.component.html',
  styleUrls: ['./vm-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, IconComponent, FormsModule, AddEditDiskModalComponent, AddEditGatewayModalComponent],
  standalone: true,
})
export class VmProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);

  vm = signal<VirtualMachine | null>(null);
  isEditing = signal(false);
  editedVm = signal<Partial<VirtualMachine>>({});
  activeTab = signal<'disk' | 'gateway' | 'snapshot'>('disk');
  
  // Tab data
  disks = signal<Disk[]>([]);
  gateways = signal<GatewayInfo[]>([]);
  snapshots = signal<Snapshot[]>([]);
  
  // Modal states
  isAddEditDiskModalOpen = signal(false);
  diskToEdit = signal<Disk | null>(null);
  isAddEditGatewayModalOpen = signal(false);
  gatewayToEdit = signal<GatewayInfo | null>(null);
  
  totalStorageCapacity = 2048; // Mock total capacity in GB
  
  usedStorage = computed(() => this.disks().reduce((acc, disk) => acc + disk.sizeGB, 0));
  availableStorage = computed(() => this.totalStorageCapacity - this.usedStorage());

  ngOnInit(): void {
    const vmId = this.route.snapshot.paramMap.get('id');
    const foundVm = VIRTUAL_MACHINES_DATA.find(v => v.id === vmId);
    if (foundVm) {
      this.vm.set(foundVm);
      this.loadTabData(foundVm.id);
    }
  }

  loadTabData(vmId: string): void {
    // Mock data based on vmId
    this.disks.set([
      { id: 'disk-1', name: 'OS Disk', sizeGB: 100, type: 'SSD' },
      { id: 'disk-2', name: 'Data Disk 1', sizeGB: 500, type: 'SSD' },
    ]);
    this.gateways.set([{ id: 'gw-1', name: 'Default Gateway', ipAddress: '192.168.1.1', status: 'Connected' }]);
    this.snapshots.set([
      { id: 'snap-1', name: 'Pre-update-snapshot', creationDate: '2023-10-26', description: 'Snapshot before applying system updates.' },
      { id: 'snap-2', name: 'Weekly Backup', creationDate: '2023-10-20', description: 'Regular weekly backup.' },
    ]);
  }
  
  startEditing(): void {
    this.editedVm.set({ ...this.vm() });
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  saveChanges(): void {
    const currentVm = this.vm();
    if (currentVm) {
        this.vm.update(vm => vm ? { ...vm, ...this.editedVm() } : null);
    }
    this.isEditing.set(false);
  }

  setActiveTab(tab: 'disk' | 'gateway' | 'snapshot'): void {
    this.activeTab.set(tab);
  }
  
  // Disk Modal Methods
  openAddDiskModal(): void {
      this.diskToEdit.set(null);
      this.isAddEditDiskModalOpen.set(true);
  }
  
  openEditDiskModal(disk: Disk): void {
      this.diskToEdit.set(disk);
      this.isAddEditDiskModalOpen.set(true);
  }
  
  handleDiskSave(diskToSave: Disk): void {
      if(this.diskToEdit()) {
          // Update existing disk
          this.disks.update(disks => disks.map(d => d.id === diskToSave.id ? diskToSave : d));
      } else {
          // Add new disk
          this.disks.update(disks => [...disks, diskToSave]);
      }
      this.isAddEditDiskModalOpen.set(false);
  }
  
  // Gateway Modal Methods
  openAddGatewayModal(): void {
      this.gatewayToEdit.set(null);
      this.isAddEditGatewayModalOpen.set(true);
  }
  
  openEditGatewayModal(gateway: GatewayInfo): void {
      this.gatewayToEdit.set(gateway);
      this.isAddEditGatewayModalOpen.set(true);
  }
  
  handleGatewaySave(gatewayToSave: GatewayInfo): void {
      if(this.gatewayToEdit()) {
          this.gateways.update(gws => gws.map(g => g.id === gatewayToSave.id ? gatewayToSave : g));
      } else {
          this.gateways.update(gws => [...gws, gatewayToSave]);
      }
      this.isAddEditGatewayModalOpen.set(false);
  }
}
