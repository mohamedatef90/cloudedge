import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { VmCardViewComponent } from './components/vm-card-view/vm-card-view.component';
import { VmTableViewComponent } from './components/vm-table-view/vm-table-view.component';
import { VirtualMachine } from './mock-data';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { VirtualMachineService } from './services/virtual-machine.service';

interface VmFilterState {
  status: 'all' | 'running' | 'stopped' | 'suspended';
  os: 'all' | 'windows' | 'ubuntu' | 'linux';
  hasReservation: boolean;
}

@Component({
  selector: 'app-virtual-machines',
  templateUrl: './virtual-machines.component.html',
  styleUrls: ['./virtual-machines.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, VmCardViewComponent, VmTableViewComponent, RouterModule, FormsModule, FilterPanelComponent, ConfirmationModalComponent],
  host: {
    '(document:mousedown)': 'onGlobalClick($event)',
  },
})
export class VirtualMachinesComponent {
  private virtualMachineService = inject(VirtualMachineService);

  viewMode = signal<'card' | 'table'>('card');
  allVirtualMachines = this.virtualMachineService.virtualMachines;
  
  isExportMenuOpen = signal(false);
  exportButtonRef = viewChild<ElementRef>('exportButtonRef');
  exportMenuRef = viewChild<ElementRef>('exportMenuRef');

  // --- Filter State ---
  searchTerm = signal('');
  isFilterPanelOpen = signal(false);

  private readonly defaultFilters: VmFilterState = {
    status: 'all',
    os: 'all',
    hasReservation: false,
  };

  filters = signal<VmFilterState>({ ...this.defaultFilters });
  tempFilters = signal<VmFilterState>({ ...this.defaultFilters });

  public readonly vmStatuses: VmFilterState['status'][] = ['all', 'running', 'stopped', 'suspended'];
  public readonly vmOses: VmFilterState['os'][] = ['all', 'windows', 'ubuntu', 'linux'];

  filteredVirtualMachines = computed(() => {
    const currentFilters = this.filters();
    const term = this.searchTerm().toLowerCase();
    
    let filtered = this.allVirtualMachines();

    // 1. Filter by search term
    if (term) {
      filtered = filtered.filter(vm => 
        vm.name.toLowerCase().includes(term) ||
        (vm.description && vm.description.toLowerCase().includes(term)) ||
        vm.ipAddress.toLowerCase().includes(term)
      );
    }

    // 2. Apply advanced filters
    return filtered.filter(vm => {
      const statusMatch = currentFilters.status === 'all' || vm.status === currentFilters.status;
      const osMatch = currentFilters.os === 'all' || vm.os === currentFilters.os;
      const reservationMatch = !currentFilters.hasReservation || vm.reservationName !== null;
      
      return statusMatch && osMatch && reservationMatch;
    });
  });

  activeFilterCount = computed(() => {
    const { status, os, hasReservation } = this.filters();
    let count = 0;
    if (status !== 'all') count++;
    if (os !== 'all') count++;
    if (hasReservation) count++;
    return count;
  });

  // --- Confirmation Modal State ---
  isConfirmModalOpen = signal(false);
  confirmModalConfig = signal({
      title: '',
      message: '',
      confirmButtonText: '',
      confirmButtonClass: '',
      iconName: '',
      iconClass: ''
  });
  selectedVmForAction = signal<VirtualMachine | null>(null);

  setViewMode(mode: 'card' | 'table'): void {
    this.viewMode.set(mode);
  }

  onGlobalClick(event: MouseEvent): void {
    if (
      this.isExportMenuOpen() &&
      this.exportButtonRef()?.nativeElement &&
      !this.exportButtonRef()!.nativeElement.contains(event.target as Node) &&
      this.exportMenuRef()?.nativeElement &&
      !this.exportMenuRef()!.nativeElement.contains(event.target as Node)
    ) {
      this.isExportMenuOpen.set(false);
    }
  }

  toggleExportMenu(): void {
    this.isExportMenuOpen.update(v => !v);
  }

  private downloadFile(data: string, filename: string, type: string): void {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.isExportMenuOpen.set(false);
  }

  exportAsCsv(): void {
    const vms = this.filteredVirtualMachines();
    const headers = ['Name', 'OS', 'Status', 'IP Address', 'Creation Date', 'Cores', 'Memory (GB)', 'Storage (GB)'];
    const selectedData = vms.map(vm => ({
      name: vm.name,
      os: vm.os,
      status: vm.status,
      ipAddress: vm.ipAddress,
      creationDate: vm.creationDate,
      cores: vm.cores,
      memory: vm.memory,
      storage: vm.storage,
    }));

    let csvContent = headers.join(',') + '\r\n';
    selectedData.forEach(row => {
      const values = Object.values(row).map(value => {
        const stringValue = String(value);
        if (stringValue.includes(',')) {
          return `"${stringValue}"`;
        }
        return stringValue;
      });
      csvContent += values.join(',') + '\r\n';
    });
    
    this.downloadFile(csvContent, 'virtual-machines.csv', 'text/csv;charset=utf-8;');
  }

  exportAsJson(): void {
    const vms = this.filteredVirtualMachines();
    const selectedData = vms.map(vm => ({
      name: vm.name,
      os: vm.os,
      status: vm.status,
      ipAddress: vm.ipAddress,
      creationDate: vm.creationDate,
      specs: {
        cores: vm.cores,
        memory_gb: vm.memory,
        storage_gb: vm.storage,
      },
      description: vm.description,
      reservation: vm.reservationName,
    }));
    const jsonContent = JSON.stringify(selectedData, null, 2);
    this.downloadFile(jsonContent, 'virtual-machines.json', 'application/json;charset=utf-8;');
  }

  // --- Filter Panel Methods ---
  openFilterPanel(): void {
    this.tempFilters.set(this.filters());
    this.isFilterPanelOpen.set(true);
  }

  closeFilterPanel(): void {
    this.isFilterPanelOpen.set(false);
  }

  applyFilters(): void {
    this.filters.set(this.tempFilters());
    this.closeFilterPanel();
  }

  clearFilters(): void {
    this.tempFilters.set({ ...this.defaultFilters });
    this.filters.set({ ...this.defaultFilters });
  }

  // --- VM Action Methods ---
  handleVmAction(event: { action: 'connect' | 'powerOff' | 'restart' | 'delete'; vm: VirtualMachine }): void {
    this.selectedVmForAction.set(event.vm);
    let config;
    switch (event.action) {
        case 'connect':
            config = {
                title: `Connect to ${event.vm.name}`,
                message: `You are about to connect to the web console for <strong>${event.vm.name}</strong>. Proceed?`,
                confirmButtonText: 'Connect',
                confirmButtonClass: 'bg-[#679a41] hover:bg-[#537d34]',
                iconName: 'fas fa-terminal',
                iconClass: 'text-gray-500'
            };
            break;
        case 'powerOff':
            config = {
                title: `Power Off ${event.vm.name}`,
                message: `Are you sure you want to power off <strong>${event.vm.name}</strong>? This is equivalent to pulling the power cord.`,
                confirmButtonText: 'Power Off',
                confirmButtonClass: 'bg-red-600 hover:bg-red-700',
                iconName: 'fas fa-power-off',
                iconClass: 'text-red-500'
            };
            break;
        case 'restart':
             config = {
                title: `Restart ${event.vm.name}`,
                message: `Are you sure you want to restart <strong>${event.vm.name}</strong>? This will abruptly stop and then start the virtual machine.`,
                confirmButtonText: 'Restart',
                confirmButtonClass: 'bg-orange-500 hover:bg-orange-600',
                iconName: 'fas fa-sync-alt',
                iconClass: 'text-orange-500'
            };
            break;
        case 'delete':
             config = {
                title: `Delete ${event.vm.name}`,
                message: `Are you sure you want to permanently delete <strong>${event.vm.name}</strong>? This action cannot be undone.`,
                confirmButtonText: 'Delete',
                confirmButtonClass: 'bg-red-600 hover:bg-red-700',
                iconName: 'fas fa-trash-alt',
                iconClass: 'text-red-500'
            };
            break;
    }
    this.confirmModalConfig.set(config);
    this.isConfirmModalOpen.set(true);
  }

  onConfirmAction(): void {
      const vm = this.selectedVmForAction();
      if (vm) {
          console.log(`Action confirmed for VM: ${vm.name}`);
          // Here you would call a service to perform the action.
          // For now, just logging it.
      }
      this.onCloseConfirmModal();
  }

  onCloseConfirmModal(): void {
      this.isConfirmModalOpen.set(false);
      this.selectedVmForAction.set(null);
  }
}
