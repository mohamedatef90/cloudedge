
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { CreateEditTaskModalComponent } from './components/create-edit-task-modal/create-edit-task-modal.component';

export interface ScheduledTask {
  id: string;
  name: string;
  targetResource: string;
  action: 'Start VM' | 'Stop VM' | 'Create Snapshot' | 'Run Script';
  schedule: string;
  lastRun: string | null;
  nextRun: string;
  status: 'Enabled' | 'Disabled';
}

type SortColumn = keyof ScheduledTask;

@Component({
  selector: 'app-scheduled-tasks',
  templateUrl: './scheduled-tasks.component.html',
  styleUrls: ['./scheduled-tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent, CreateEditTaskModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class ScheduledTasksComponent {
  tasks = signal<ScheduledTask[]>([
    { id: 'task-1', name: 'Nightly VM Shutdown', targetResource: 'All Dev VMs', action: 'Stop VM', schedule: 'Daily at 2:00 AM UTC', lastRun: '2024-07-30 02:00 UTC', nextRun: '2024-07-31 02:00 UTC', status: 'Enabled' },
    { id: 'task-2', name: 'Weekly DB Snapshot', targetResource: 'sql-database-main', action: 'Create Snapshot', schedule: 'Every Sunday at 4:00 AM UTC', lastRun: '2024-07-28 04:00 UTC', nextRun: '2024-08-04 04:00 UTC', status: 'Enabled' },
    { id: 'task-3', name: 'Prod Web Server Restart', targetResource: 'prod-web-server-01', action: 'Start VM', schedule: 'First day of month', lastRun: '2024-07-01 01:00 UTC', nextRun: '2024-08-01 01:00 UTC', status: 'Disabled' },
    { id: 'task-4', name: 'Cleanup Script', targetResource: 'Storage Account', action: 'Run Script', schedule: 'Every Friday at 11:00 PM UTC', lastRun: '2024-07-26 23:00 UTC', nextRun: '2024-08-02 23:00 UTC', status: 'Enabled' },
  ]);

  isModalOpen = signal(false);
  taskToEdit = signal<ScheduledTask | null>(null);
  openActionMenuId = signal<string | null>(null);
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('nextRun');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    const filtered = this.tasks().filter(task =>
      task.name.toLowerCase().includes(term) ||
      task.targetResource.toLowerCase().includes(term) ||
      task.action.toLowerCase().includes(term) ||
      task.schedule.toLowerCase().includes(term)
    );

    return [...filtered].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;

      if (aValue === null || bValue === null) {
        comparison = aValue === bValue ? 0 : aValue === null ? 1 : -1;
      } else if (column === 'lastRun' || column === 'nextRun') {
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  });

  onGlobalClick(target: HTMLElement): void {
    if (!target.closest('.action-menu-container')) {
      this.closeActionMenu();
    }
  }

  setSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  toggleActionMenu(id: string): void {
    this.openActionMenuId.update(currentId => (currentId === id ? null : id));
  }

  closeActionMenu(): void {
    this.openActionMenuId.set(null);
  }
  
  openCreateModal(): void {
    this.taskToEdit.set(null);
    this.isModalOpen.set(true);
  }
  
  openEditModal(task: ScheduledTask): void {
    this.taskToEdit.set(task);
    this.isModalOpen.set(true);
    this.closeActionMenu();
  }
  
  closeModal(): void {
    this.isModalOpen.set(false);
    this.taskToEdit.set(null);
  }

  handleSaveTask(taskData: Omit<ScheduledTask, 'id' | 'lastRun' | 'nextRun'>): void {
    const taskToEdit = this.taskToEdit();
    if (taskToEdit) {
      // Update
      this.tasks.update(tasks =>
        tasks.map(t => t.id === taskToEdit.id ? { ...taskToEdit, ...taskData } : t)
      );
    } else {
      // Create
      const newTask: ScheduledTask = {
        id: `task-${Date.now()}`,
        ...taskData,
        lastRun: null, // New tasks haven't run yet
        nextRun: 'Pending calculation', // This would be calculated by a backend in a real app
      };
      this.tasks.update(tasks => [newTask, ...tasks]);
    }
    this.closeModal();
  }
  
  handleDeleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    }
    this.closeActionMenu();
  }

  toggleTaskStatus(task: ScheduledTask, event: boolean): void {
    this.tasks.update(tasks => tasks.map(t =>
      t.id === task.id ? { ...t, status: event ? 'Enabled' : 'Disabled' } : t
    ));
  }
}
