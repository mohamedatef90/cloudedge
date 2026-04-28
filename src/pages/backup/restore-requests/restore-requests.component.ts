import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/icon/icon.component';

export interface RestoreRequest {
  id: string;
  name: string;
  backupJobName: string;
  requestedAt: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
}

@Component({
  selector: 'app-restore-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
<div class="rounded-xl p-6 bg-white dark:bg-slate-800 shadow animate-in fade-in duration-300">
  <div class="flex flex-wrap justify-between items-center gap-4 pb-4 mb-4 border-b border-gray-200 dark:border-slate-700">
    <div>
      <h1 class="text-2xl font-bold text-[#293c51] dark:text-gray-200">Restore Requests</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage and monitor your backup restore requests.</p>
    </div>
  </div>

  <!-- Actions Bar -->
  <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
    <button class="w-full sm:w-auto bg-[#679a41] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#537d34] transition-all duration-200 ease-in-out flex items-center justify-center shadow-sm">
      <app-icon name="fas fa-plus" className="mr-2 text-xs"></app-icon>
      Create Request
    </button>

    <div class="relative w-full sm:max-w-xs">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <app-icon name="fas fa-search" className="text-gray-400" />
      </div>
      <input 
        type="text" 
        placeholder="Search requests..." 
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#679a41] dark:focus:ring-[#8cc866] sm:text-sm"
      />
    </div>
  </div>

  <div class="shadow-sm sm:rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-4 font-semibold">Name</th>
            <th scope="col" class="px-6 py-4 font-semibold">Backup Job</th>
            <th scope="col" class="px-6 py-4 font-semibold">Requested At</th>
            <th scope="col" class="px-6 py-4 font-semibold">Status</th>
            <th scope="col" class="px-6 py-4 text-right w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (req of requests(); track req.id; let i = $index; let count = $count) {
            <tr class="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors h-[52px]">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white align-top pt-4">{{ req.name }}</td>
              <td class="px-6 py-4 align-top pt-4">{{ req.backupJobName }}</td>
              <td class="px-6 py-4 align-top pt-4">{{ req.requestedAt }}</td>
              <td class="px-6 py-4 align-top pt-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  [ngClass]="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400': req.status === 'Pending',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400': req.status === 'In Progress',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': req.status === 'Completed',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': req.status === 'Failed'
                  }">
                  {{ req.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right align-top pt-3">
                <div class="relative inline-block action-menu-container">
                  <button (click)="toggleMenu(req.id)" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#679a41]">
                    <app-icon name="fas fa-ellipsis-v"></app-icon>
                  </button>
                  @if (openMenuId() === req.id) {
                    <div class="absolute right-0 w-36 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-10 text-left border border-gray-100 dark:border-slate-700"
                      [class.origin-top-right]="i < count - 2" [class.mt-1]="i < count - 2"
                      [class.origin-bottom-right]="i >= count - 2" [class.bottom-full]="i >= count - 2" [class.mb-1]="i >= count - 2">
                      <a href="#" (click)="$event.preventDefault(); closeMenu()" class="flex items-center px-4 py-2 text-sm text-[#293c51] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 hover:text-[#679a41] dark:hover:text-[#8cc866] transition-colors gap-3">
                        <app-icon name="fas fa-eye" className="w-4 text-center"></app-icon>
                        <span>View</span>
                      </a>
                      <div class="border-t border-gray-100 dark:border-slate-700 my-1"></div>
                      <a href="#" (click)="$event.preventDefault(); deleteRequest(req.id)" class="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors gap-3">
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
                    <app-icon name="fas fa-undo" className="text-2xl text-gray-400" />
                  </div>
                  <p class="font-bold text-[#293c51] dark:text-gray-200 text-lg mb-1">No restore requests found</p>
                  <p class="text-sm mb-6 max-w-md">You don't have any active or past restore requests.</p>
                  <button class="bg-[#679a41] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#537d34] transition-all flex items-center shadow-sm">
                    <app-icon name="fas fa-plus" className="mr-2 text-xs" />
                    Create Request
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
  `
})
export class RestoreRequestsComponent {
  requests = signal<RestoreRequest[]>([
    { id: '1', name: 'Restore DB to yesterday', backupJobName: 'Nightly Database Backup', requestedAt: '2023-11-05 10:00 AM', status: 'Completed' },
    { id: '2', name: 'Restore Files HR', backupJobName: 'Weekly File Server Backup', requestedAt: '2023-11-06 02:30 PM', status: 'In Progress' }
  ]);

  openMenuId = signal<string | null>(null);

  toggleMenu(id: string) {
    this.openMenuId.update(current => current === id ? null : id);
  }

  closeMenu() {
    this.openMenuId.set(null);
  }

  deleteRequest(id: string) {
    this.requests.update(reqs => reqs.filter(r => r.id !== id));
    this.closeMenu();
  }
}

