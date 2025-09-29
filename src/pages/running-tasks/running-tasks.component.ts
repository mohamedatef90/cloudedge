
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';

interface RunningTask {
  id: string;
  taskName: string;
  targetResource: string;
  action: string;
  status: 'Running' | 'Success' | 'Failed' | 'Pending';
  progress: number;
  startTime: string;
  endTime: string | null;
  initiatedBy: string;
}

type StatusFilter = 'all' | 'Running' | 'Success' | 'Failed' | 'Pending';

@Component({
  selector: 'app-running-tasks',
  templateUrl: './running-tasks.component.html',
  styleUrls: ['./running-tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class RunningTasksComponent {
  tasks = signal<RunningTask[]>([
    { id: 'run-1', taskName: 'Provision New VM', targetResource: 'k8s-worker-node-b', action: 'Create VM', status: 'Running', progress: 75, startTime: '2024-07-30 10:00 UTC', endTime: null, initiatedBy: 'Admin' },
    { id: 'run-2', taskName: 'Nightly VM Shutdown', targetResource: 'All Dev VMs', action: 'Stop VM', status: 'Success', progress: 100, startTime: '2024-07-30 02:00 UTC', endTime: '2024-07-30 02:05 UTC', initiatedBy: 'Scheduler' },
    // FIX: Replaced `name` with `taskName` to match the RunningTask interface.
    { id: 'run-3', taskName: 'Apply Security Patch', targetResource: 'prod-web-server-01', action: 'Run Script', status: 'Failed', progress: 30, startTime: '2024-07-29 20:00 UTC', endTime: '2024-07-29 20:01 UTC', initiatedBy: 'Admin' },
    // FIX: Replaced `name` with `taskName` to match the RunningTask interface.
    { id: 'run-4', taskName: 'Weekly DB Snapshot', targetResource: 'sql-database-main', action: 'Create Snapshot', status: 'Success', progress: 100, startTime: '2024-07-28 04:00 UTC', endTime: '2024-07-28 04:15 UTC', initiatedBy: 'Scheduler' },
    // FIX: Replaced `name` with `taskName` to match the RunningTask interface.
    { id: 'run-5', taskName: 'Scale Out Web Tier', targetResource: 'Web Server Group', action: 'Add VM', status: 'Pending', progress: 0, startTime: '2024-07-30 10:05 UTC', endTime: null, initiatedBy: 'Auto-scaler' },
  ]);
  
  statusFilter = signal<StatusFilter>('all');
  isRefreshing = signal(false);

  filteredTasks = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'all') {
      return this.tasks();
    }
    return this.tasks().filter(task => task.status === filter);
  });
  
  statusOptions: StatusFilter[] = ['all', 'Running', 'Success', 'Failed', 'Pending'];

  handleRefresh(): void {
    this.isRefreshing.set(true);
    // Simulate a network request
    setTimeout(() => {
      // Here you would typically re-fetch data
      // For the demo, we'll just toggle a task's progress
      this.tasks.update(tasks => tasks.map(t => t.id === 'run-1' ? {...t, progress: Math.min(t.progress + 10, 100)} : t));
      this.isRefreshing.set(false);
    }, 500);
  }

  getStatusClasses(status: RunningTask['status']): { badge: string, icon: string, text: string } {
    switch (status) {
      case 'Running': return { badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', icon: 'fas fa-spinner fa-spin', text: 'text-blue-500' };
      case 'Success': return { badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', icon: 'fas fa-check-circle', text: 'text-green-500' };
      case 'Failed': return { badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', icon: 'fas fa-times-circle', text: 'text-red-500' };
      case 'Pending': return { badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', icon: 'fas fa-clock', text: 'text-yellow-500' };
    }
  }
}