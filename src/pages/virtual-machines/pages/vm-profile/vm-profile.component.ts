
import { ChangeDetectionStrategy, Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VirtualMachine, VIRTUAL_MACHINES_DATA } from '../../mock-data';
import { AddEditDiskModalComponent, Disk } from './components/add-edit-disk-modal/add-edit-disk-modal.component';
import { AddEditGatewayModalComponent, GatewayInfo } from './components/add-edit-gateway-modal/add-edit-gateway-modal.component';
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';


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
  imports: [CommonModule, RouterModule, IconComponent, FormsModule, AddEditDiskModalComponent, AddEditGatewayModalComponent, ConfirmationModalComponent],
  standalone: true,
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class VmProfileComponent implements OnInit {
  // FIX: Explicitly type `ActivatedRoute` to prevent it from being inferred as `unknown`.
  private route: ActivatedRoute = inject(ActivatedRoute);

  vm = signal<VirtualMachine | null>(null);
  isEditing = signal(false);
  editedVm = signal<Partial<VirtualMachine>>({});
  activeTab = signal<'disk' | 'gateway' | 'snapshot'>('disk');
  openMenuId = signal<string | null>(null);
  
  // Tab data
  disks = signal<Disk[]>([]);
  gateways = signal<GatewayInfo[]>([]);
  snapshots = signal<Snapshot[]>([]);
  
  // Modal states
  isAddEditDiskModalOpen = signal(false);
  diskToEdit = signal<Disk | null>(null);
  isAddEditGatewayModalOpen = signal(false);
  gatewayToEdit = signal<GatewayInfo | null>(null);
  
  // Confirmation Modal State
  isConfirmModalOpen = signal(false);
  confirmModalConfig = signal({
      title: '',
      message: '',
      confirmButtonText: '',
      confirmButtonClass: '',
      iconName: '',
      iconClass: ''
  });

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

  onGlobalClick(target: EventTarget | null): void {
    const clickedInside = (target as HTMLElement)?.closest('.vm-menu-container');
    if (!clickedInside) {
      this.openMenuId.set(null);
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

  // VM Action Methods
  handleVmAction(action: 'connect' | 'powerOff' | 'restart' | 'delete'): void {
    const vm = this.vm();
    if (!vm) return;

    let config;
    switch (action) {
        case 'connect':
            config = {
                title: `Connect to ${vm.name}`,
                message: `You are about to connect to the web console for <strong>${vm.name}</strong>. Proceed?`,
                confirmButtonText: 'Connect',
                confirmButtonClass: 'bg-[#679a41] hover:bg-[#537d34]',
                iconName: 'fas fa-terminal',
                iconClass: 'text-gray-500'
            };
            break;
        case 'powerOff':
            config = {
                title: `Power Off ${vm.name}`,
                message: `Are you sure you want to power off <strong>${vm.name}</strong>? This is equivalent to pulling the power cord.`,
                confirmButtonText: 'Power Off',
                confirmButtonClass: 'bg-red-600 hover:bg-red-700',
                iconName: 'fas fa-power-off',
                iconClass: 'text-red-500'
            };
            break;
        case 'restart':
             config = {
                title: `Restart ${vm.name}`,
                message: `Are you sure you want to restart <strong>${vm.name}</strong>? This will abruptly stop and then start the virtual machine.`,
                confirmButtonText: 'Restart',
                confirmButtonClass: 'bg-orange-500 hover:bg-orange-600',
                iconName: 'fas fa-sync-alt',
                iconClass: 'text-orange-500'
            };
            break;
        case 'delete':
             config = {
                title: `Delete ${vm.name}`,
                message: `Are you sure you want to permanently delete <strong>${vm.name}</strong>? This action cannot be undone.`,
                confirmButtonText: 'Delete',
                confirmButtonClass: 'bg-red-600 hover:bg-red-700',
                iconName: 'fas fa-trash-alt',
                iconClass: 'text-red-500'
            };
            break;
    }
    this.confirmModalConfig.set(config);
    this.isConfirmModalOpen.set(true);
    this.openMenuId.set(null);
  }

  onConfirmAction(): void {
      const vm = this.vm();
      if (vm) {
          console.log(`Action confirmed for VM: ${vm.name}`);
          // Here you would call a service to perform the action.
          // For now, just logging it.
      }
      this.onCloseConfirmModal();
  }

  onCloseConfirmModal(): void {
      this.isConfirmModalOpen.set(false);
  }
}
