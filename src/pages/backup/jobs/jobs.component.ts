import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../../distributed-firewall/components/toggle-switch/toggle-switch.component';

export interface BackupJob {
  id: string;
  name: string;
  description: string;
  isHighPriority: boolean;
  reservation: string;
  status: boolean;
  selectedVmIds: string[];
}

interface VMItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-backup-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
  template: `
<div class="rounded-xl p-6 bg-white dark:bg-slate-800 shadow animate-in fade-in duration-300">
  <div class="flex flex-wrap justify-between items-center gap-4 pb-4 mb-4 border-b border-gray-200 dark:border-slate-700">
    <div>
      <h1 class="text-2xl font-bold text-[#293c51] dark:text-gray-200">Backup Jobs</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage and monitor your backup jobs.</p>
    </div>
  </div>

  <!-- Actions Bar -->
  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
    <button class="w-full sm:w-auto bg-[#679a41] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#537d34] transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm">
      <app-icon name="fas fa-plus" className="mr-2 text-xs"></app-icon>
      Create Job
    </button>

    <div class="relative w-full sm:max-w-xs">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <app-icon name="fas fa-search" className="text-gray-400" />
      </div>
      <input 
        type="text" 
        placeholder="Search jobs..." 
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#679a41] dark:focus:ring-[#8cc866] sm:text-sm"
      />
    </div>
  </div>

  <div class="shadow-sm sm:rounded-lg border border-gray-200 dark:border-slate-700">
    <div class="overflow-visible min-h-[300px]">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-4 font-semibold">Name</th>
            <th scope="col" class="px-6 py-4 font-semibold">Description</th>
            <th scope="col" class="px-6 py-4 font-semibold text-center w-40">Is High Priority</th>
            <th scope="col" class="px-6 py-4 font-semibold">Reservation</th>
            <th scope="col" class="px-6 py-4 text-right w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (job of jobs(); track job.id; let i = $index; let count = $count) {
            <tr class="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors h-[52px]">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ job.name }}</td>
              <td class="px-6 py-4">{{ job.description }}</td>
              <td class="px-6 py-4 text-center align-top pt-5">
                <app-toggle-switch [ngModel]="job.isHighPriority" (ngModelChange)="togglePriority(job.id, $event)" size="sm" />
              </td>
              <td class="px-6 py-4">{{ job.reservation }}</td>
              <td class="px-6 py-4 text-right align-top pt-4" [class.z-50]="openMenuId() === job.id" [class.relative]="openMenuId() === job.id">
                <div class="relative inline-block action-menu-container">
                  <button (click)="toggleMenu(job.id)" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#679a41]">
                    <app-icon name="fas fa-ellipsis-v"></app-icon>
                  </button>
                  @if (openMenuId() === job.id) {
                    <div class="absolute right-0 w-36 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-[100] text-left border border-gray-100 dark:border-slate-700"
                      [class.origin-top-right]="i < count - 2" [class.mt-1]="i < count - 2"
                      [class.origin-bottom-right]="i >= count - 2" [class.bottom-full]="i >= count - 2" [class.mb-1]="i >= count - 2">
                      <a href="#" (click)="$event.preventDefault(); openEdit(job)" class="flex items-center px-4 py-2 text-sm text-[#293c51] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 hover:text-[#679a41] dark:hover:text-[#8cc866] transition-colors gap-3">
                        <app-icon name="fas fa-pencil-alt" className="w-4 text-center"></app-icon>
                        <span>Edit</span>
                      </a>
                      <div class="border-t border-gray-100 dark:border-slate-700 my-1"></div>
                      <a href="#" (click)="$event.preventDefault(); deleteJob(job.id)" class="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors gap-3">
                        <app-icon name="fas fa-trash-alt" className="w-4 text-center"></app-icon>
                        <span>Delete</span>
                      </a>
                    </div>
                  }
                </div>
              </td>
            </tr>
          } @empty {
            <tr class="bg-white dark:bg-slate-800">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <div class="flex flex-col items-center justify-center">
                  <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                    <app-icon name="fas fa-database" className="text-2xl text-gray-400" />
                  </div>
                  <p class="font-bold text-[#293c51] dark:text-gray-200 text-lg mb-1">No backup jobs found</p>
                  <p class="text-sm mb-6 max-w-md">You haven't setup any backup jobs. Create your first job to start protecting your data.</p>
                  <button class="bg-[#679a41] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#537d34] transition-all flex items-center shadow-sm">
                    <app-icon name="fas fa-plus" className="mr-2 text-xs" />
                    Create Job
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Edit Job Modal -->
@if (isEditModalOpen() && editingJob()) {
  <div class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 animate-in fade-in duration-200" (click)="closeEdit($event)" id="modal-backdrop">
    <div class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h3 class="text-xl font-bold text-[#293c51] dark:text-white">Edit Backup Job</h3>
        <button (click)="closeEdit()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none">
          <app-icon name="fas fa-times" className="text-lg"></app-icon>
        </button>
      </div>

      <!-- Tabs -->
      <div class="px-6 border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
        <nav class="-mb-px flex space-x-6">
          @for (tab of tabs; track tab) {
            <button 
              (click)="activeTab.set(tab)"
              [class.border-[#679a41]]="activeTab() === tab"
              [class.text-[#679a41]]="activeTab() === tab"
              [class.border-transparent]="activeTab() !== tab"
              [class.text-gray-500]="activeTab() !== tab"
              [class.hover:text-gray-700]="activeTab() !== tab"
              [class.hover:border-gray-300]="activeTab() !== tab"
              class="whitespace-nowrap pb-3 pt-4 px-1 border-b-2 font-medium text-sm transition-colors">
              {{ tab }}
            </button>
          }
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-6">
        @if (activeTab() === 'Details') {
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-[#293c51] dark:text-gray-200 mb-1.5">Name</label>
              <input type="text" [(ngModel)]="editingJob()!.name" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#679a41] dark:bg-slate-700 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#293c51] dark:text-gray-200 mb-1.5">Reservation Name</label>
              <input type="text" [(ngModel)]="editingJob()!.reservation" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#679a41] dark:bg-slate-700 dark:text-white" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#293c51] dark:text-gray-200 mb-1.5">Description</label>
              <textarea [(ngModel)]="editingJob()!.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#679a41] dark:bg-slate-700 dark:text-white resize-none"></textarea>
            </div>

            <div class="flex items-center justify-between py-2 border-y border-gray-100 dark:border-slate-700">
              <div>
                <label class="block text-sm font-semibold text-[#293c51] dark:text-gray-200">Status</label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Enable or disable this job</p>
              </div>
              <app-toggle-switch [(ngModel)]="editingJob()!.status" size="md" />
            </div>
          </div>
        }
        @if (activeTab() === 'VM') {
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-[#293c51] dark:text-gray-200">Virtual Machines Selection</h4>
            <div class="flex flex-col md:flex-row gap-4 items-stretch h-[320px]">
              
              <!-- Available VMs -->
              <div class="flex-1 flex flex-col border border-gray-300 dark:border-slate-600 rounded-md overflow-hidden bg-white dark:bg-slate-700/50">
                <div class="px-3 py-2 bg-gray-50 dark:bg-slate-600 border-b border-gray-300 dark:border-slate-600 font-medium text-xs text-gray-700 dark:text-gray-300 flex justify-between items-center">
                  <span>Available VMs</span>
                  <span class="bg-gray-200 dark:bg-slate-500 text-gray-600 dark:text-gray-300 px-2 rounded-full">{{ getAvailableVms().length }}</span>
                </div>
                <!-- Search -->
                <div class="p-2 border-b border-gray-200 dark:border-slate-600 shrink-0">
                   <div class="relative">
                     <app-icon name="fas fa-search" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" />
                     <input type="text" [(ngModel)]="vmSearchAvailable" placeholder="Search..." class="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 dark:border-slate-500 rounded bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#679a41]">
                   </div>
                </div>
                <ul class="flex-1 overflow-y-auto p-1">
                  @for (vm of getFilteredAvailableVms(); track vm.id) {
                    <li 
                      (click)="toggleVmSelection(vm.id, 'available')"
                      [class.bg-[#f3f7f0]]="selectedAvailableVmIds().includes(vm.id)"
                      [class.dark:bg-[#8cc866]/20]="selectedAvailableVmIds().includes(vm.id)"
                      [class.border-[#8ec270]]="selectedAvailableVmIds().includes(vm.id)"
                      [class.border-transparent]="!selectedAvailableVmIds().includes(vm.id)"
                      class="px-3 py-2 text-sm border hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer rounded mb-1 text-gray-700 dark:text-gray-200 flex items-center transition-colors">
                      <app-icon name="fas fa-server" className="mr-2 text-gray-400 text-xs" />
                      {{ vm.name }}
                    </li>
                  }
                </ul>
              </div>

              <!-- Controls -->
              <div class="flex flex-row md:flex-col justify-center gap-2 px-2 md:px-0 shrink-0">
                 <button 
                  (click)="moveVmsToSelected()"
                  [disabled]="selectedAvailableVmIds().length === 0"
                  class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-[#8ec270] hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-500 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-[#8cc866] dark:hover:text-slate-900 transition-colors">
                   <app-icon name="fas fa-chevron-right" className="hidden md:block text-sm" />
                   <app-icon name="fas fa-chevron-down" className="block md:hidden text-sm" />
                 </button>
                 <button 
                  (click)="moveVmsToAvailable()"
                  [disabled]="selectedSelectedVmIds().length === 0"
                  class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-[#8ec270] hover:text-white disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-500 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-[#8cc866] dark:hover:text-slate-900 transition-colors">
                   <app-icon name="fas fa-chevron-left" className="hidden md:block text-sm" />
                   <app-icon name="fas fa-chevron-up" className="block md:hidden text-sm" />
                 </button>
              </div>

              <!-- Selected VMs -->
              <div class="flex-1 flex flex-col border border-gray-300 dark:border-slate-600 rounded-md overflow-hidden bg-white dark:bg-slate-700/50">
                <div class="px-3 py-2 bg-[#f3f7f0] dark:bg-[#8cc866]/10 border-b border-[#8ec270]/30 dark:border-[#8cc866]/30 font-medium text-xs text-[#293c51] dark:text-[#8cc866] flex justify-between items-center">
                  <span>Selected VMs</span>
                  <span class="bg-[#8ec270] text-white px-2 rounded-full">{{ editingJob()?.selectedVmIds?.length || 0 }}</span>
                </div>
                <div class="p-2 border-b border-gray-200 dark:border-slate-600 shrink-0">
                   <div class="relative">
                     <app-icon name="fas fa-search" className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-[10px]" />
                     <input type="text" [(ngModel)]="vmSearchSelected" placeholder="Search..." class="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 dark:border-slate-500 rounded bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#679a41]">
                   </div>
                </div>
                <ul class="flex-1 overflow-y-auto p-1">
                  @for (vm of getFilteredSelectedVms(); track vm.id) {
                    <li 
                      (click)="toggleVmSelection(vm.id, 'selected')"
                      [class.bg-gray-100]="selectedSelectedVmIds().includes(vm.id)"
                      [class.dark:bg-slate-600]="selectedSelectedVmIds().includes(vm.id)"
                      [class.border-gray-300]="selectedSelectedVmIds().includes(vm.id)"
                      [class.dark:border-slate-500]="selectedSelectedVmIds().includes(vm.id)"
                      [class.border-transparent]="!selectedSelectedVmIds().includes(vm.id)"
                      class="px-3 py-2 text-sm border hover:bg-gray-50 dark:hover:bg-slate-600 cursor-pointer rounded mb-1 text-[#293c51] dark:text-gray-200 flex items-center transition-colors">
                      <app-icon name="fas fa-server" className="mr-2 text-[#8ec270] text-xs" />
                      {{ vm.name }}
                    </li>
                  } @empty {
                    @if (!vmSearchSelected()) {
                      <div class="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-4 text-center">
                        <app-icon name="fas fa-arrow-left" className="text-xl mb-2 hidden md:block opacity-50" />
                        <app-icon name="fas fa-arrow-up" className="text-xl mb-2 block md:hidden opacity-50" />
                        <span class="text-xs">Select VMs to include</span>
                      </div>
                    }
                  }
                </ul>
              </div>
            </div>
          </div>
        }
        @if (activeTab() === 'Storage') {
          <p class="text-sm text-gray-500 dark:text-gray-400">Storage configuration settings will go here.</p>
        }
        @if (activeTab() === 'Schedule') {
          <p class="text-sm text-gray-500 dark:text-gray-400">Schedule configuration settings will go here.</p>
        }
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-b-xl flex justify-end gap-3 shrink-0">
        <button (click)="closeEdit()" class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          Cancel
        </button>
        <button (click)="saveJob()" class="bg-[#679a41] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#537d34] transition-colors shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  </div>
}
  `
})
export class JobsComponent {
  jobs = signal<BackupJob[]>([
    { id: '1', name: 'Nightly Database Backup', description: 'Full backup of main database.', isHighPriority: true, reservation: 'VDC1', status: true, selectedVmIds: ['vm3', 'vm4'] },
    { id: '2', name: 'Weekly File Server Backup', description: 'Incremental backup of user files.', isHighPriority: false, reservation: 'VDC2', status: false, selectedVmIds: ['vm1'] }
  ]);

  openMenuId = signal<string | null>(null);
  
  // Edit Modal State
  isEditModalOpen = signal(false);
  editingJob = signal<BackupJob | null>(null);
  tabs = ['Details', 'VM', 'Storage', 'Schedule'] as const;
  activeTab = signal<typeof this.tabs[number]>('Details');

  // VM Transfer List State
  allVms = signal<VMItem[]>([
    { id: 'vm1', name: 'App-Server-01' },
    { id: 'vm2', name: 'App-Server-02' },
    { id: 'vm3', name: 'DB-Node-01' },
    { id: 'vm4', name: 'DB-Node-02' },
    { id: 'vm5', name: 'Cache-Redis-01' },
    { id: 'vm6', name: 'Web-Proxy-01' },
    { id: 'vm7', name: 'Web-Proxy-02' },
    { id: 'vm8', name: 'Worker-Node-01' },
  ]);

  vmSearchAvailable = signal('');
  vmSearchSelected = signal('');

  selectedAvailableVmIds = signal<string[]>([]);
  selectedSelectedVmIds = signal<string[]>([]);

  toggleMenu(id: string) {
    this.openMenuId.update(current => current === id ? null : id);
  }

  closeMenu() {
    this.openMenuId.set(null);
  }

  togglePriority(id: string, isHigh: boolean) {
    this.jobs.update(jobs => jobs.map(j => j.id === id ? { ...j, isHighPriority: isHigh } : j));
  }

  deleteJob(id: string) {
    this.jobs.update(jobs => jobs.filter(j => j.id !== id));
    this.closeMenu();
  }

  openEdit(job: BackupJob) {
    this.editingJob.set({ ...job, selectedVmIds: [...(job.selectedVmIds || [])] }); // Clone job for editing
    this.activeTab.set('Details');
    this.isEditModalOpen.set(true);
    this.closeMenu();
    this.vmSearchAvailable.set('');
    this.vmSearchSelected.set('');
    this.selectedAvailableVmIds.set([]);
    this.selectedSelectedVmIds.set([]);
  }

  closeEdit(event?: MouseEvent) {
    if (event) {
      if ((event.target as HTMLElement).id === 'modal-backdrop') {
        this.isEditModalOpen.set(false);
        this.editingJob.set(null);
      }
      return;
    }
    this.isEditModalOpen.set(false);
    this.editingJob.set(null);
  }

  saveJob() {
    const edited = this.editingJob();
    if (edited) {
      this.jobs.update(jobs => jobs.map(j => j.id === edited.id ? { ...edited } : j));
    }
    this.closeEdit();
  }

  getAvailableVms(): VMItem[] {
    const selectedIds = this.editingJob()?.selectedVmIds || [];
    return this.allVms().filter(vm => !selectedIds.includes(vm.id));
  }

  getFilteredAvailableVms(): VMItem[] {
    const term = this.vmSearchAvailable().toLowerCase();
    return this.getAvailableVms().filter(vm => vm.name.toLowerCase().includes(term));
  }

  getFilteredSelectedVms(): VMItem[] {
    const selectedIds = this.editingJob()?.selectedVmIds || [];
    const term = this.vmSearchSelected().toLowerCase();
    return this.allVms()
      .filter(vm => selectedIds.includes(vm.id))
      .filter(vm => vm.name.toLowerCase().includes(term));
  }

  toggleVmSelection(vmId: string, listType: 'available' | 'selected') {
    if (listType === 'available') {
        this.selectedAvailableVmIds.update(ids => 
          ids.includes(vmId) ? ids.filter(id => id !== vmId) : [...ids, vmId]
        );
    } else {
        this.selectedSelectedVmIds.update(ids => 
          ids.includes(vmId) ? ids.filter(id => id !== vmId) : [...ids, vmId]
        );
    }
  }

  moveVmsToSelected() {
    const job = this.editingJob();
    if (!job) return;
    const toMove = this.selectedAvailableVmIds();
    this.editingJob.set({
      ...job,
      selectedVmIds: [...(job.selectedVmIds || []), ...toMove]
    });
    this.selectedAvailableVmIds.set([]);
  }

  moveVmsToAvailable() {
    const job = this.editingJob();
    if (!job) return;
    const toMove = this.selectedSelectedVmIds();
    this.editingJob.set({
      ...job,
      selectedVmIds: (job.selectedVmIds || []).filter(id => !toMove.includes(id))
    });
    this.selectedSelectedVmIds.set([]);
  }
}

