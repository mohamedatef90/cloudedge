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
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';

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
  imports: [CommonModule, IconComponent, VmCardViewComponent, VmTableViewComponent, RouterModule, FormsModule, FilterPanelComponent, ConfirmationModalComponent, AdvancedDeleteConfirmationModalComponent],
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

  // --- Confirmation Modal State (Non-delete actions) ---
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
  actionToConfirm = signal<'connect' | 'powerOff' | 'restart' | null>(null);
  
  // --- Delete Modal State ---
  isDeleteModalOpen = signal(false);
  vmToDelete = signal<VirtualMachine | null>(null);

  deleteModalMessage = computed(() => {
    const vmName = this.vmToDelete()?.name;
    if (!vmName) return '';
    return `
        <p class="mb-2">If this VM is running, it will be powered off before being moved to the Recycle Bin.</p>
        <p>You can't get your deleted virtual machine data (OS, hard disks,...) after 24 hour from now.</p>
        <p class="mt-2">You could recover deleted virtual machine within 24 hour from recycle bin.</p>
        <p class="mt-4">To proceed, please type the name of the Virtual Machine (<strong class="text-gray-900 dark:text-gray-100">${vmName}</strong>) below.</p>
    `;
  });

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
    selectedData.forEach