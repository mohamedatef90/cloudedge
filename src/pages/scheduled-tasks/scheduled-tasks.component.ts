

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';

export interface ScheduledTask {
  id: string;
  status: 'Enabled' | 'Disabled';
  action: string;
  recurring: string;
  objectName: string;
  type: string;
  startEndDate: string;
  recurringTime: string;
  maxCount: number | string;
}

export interface ScheduledGroup {
  id: string;
  name: string;
  isExpanded: boolean;
  status: 'Enabled' | 'Disabled';
  tasks: ScheduledTask[];
}

@Component({
  selector: 'app-scheduled-tasks',
  templateUrl: './scheduled-tasks.component.html',
  styleUrls: ['./scheduled-tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent, AdvancedDeleteConfirmationModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class ScheduledTasksComponent {
  groups = signal<ScheduledGroup[]>([
    {
      id: 'group-1',
      name: 'Nightly Operations',
      isExpanded: true,
      status: 'Enabled',
      tasks: [
        { id: 'task-1', status: 'Enabled', action: 'Stop VM', recurring: 'Yes', objectName: 'All Dev VMs', type: 'Virtual Machine', startEndDate: '2024-07-01 / Never', recurringTime: '02:00 UTC', maxCount: 'Unlimited' },
        { id: 'task-2', status: 'Enabled', action: 'Create Snapshot', recurring: 'Yes', objectName: 'sql-database-main', type: 'Database', startEndDate: '2024-07-01 / Never', recurringTime: '04:00 UTC', maxCount: 5 }
      ]
    },
    {
      id: 'group-2',
      name: 'Maintenance Scripts',
      isExpanded: false,
      status: 'Disabled',
      tasks: [
        { id: 'task-3', status: 'Disabled', action: 'Run Script', recurring: 'No', objectName: 'Storage Cleanup', type: 'Script', startEndDate: '2024-08-01 / 2024-08-01', recurringTime: 'N/A', maxCount: 1 }
      ]
    }
  ]);

  openActionMenuId = signal<string | null>(null);
  searchTerm = signal('');

  isDeleteModalOpen = signal(false);
  taskToDelete = signal<{groupId: string, taskId: string} | null>(null);

  isCreateModalOpen = signal(false);
  newTaskName = signal('');
  newTaskReservation = signal('');
  newTaskDescription = signal('');
  newTaskStatus = signal<'Enabled' | 'Disabled'>('Enabled');

  isTaskDetailModalOpen = signal(false);
  detailObjectType = signal('VirtualMachine');
  detailObject = signal('');
  detailActionType = signal<'One Action' | 'Group of actions'>('One Action');
  detailAction = signal('Snapshot');
  detailMaxCount = signal('10');
  detailRecurring = signal('Daily');
  detailRecurringValue = signal('1');
  detailStartDate = signal('');
  detailEndDate = signal('');
  detailRecurringTime = signal('');
  detailActive = signal(true);

  filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase();
    
    if (!term) return this.groups();

    return this.groups().map(group => {
      // check if group matches
      if (group.name.toLowerCase().includes(term)) {
        return group;
      }
      // filter tasks
      const filteredTasks = group.tasks.filter(t => 
        t.action.toLowerCase().includes(term) || t.objectName.toLowerCase().includes(term)
      );
      if (filteredTasks.length > 0) {
        return { ...group, tasks: filteredTasks, isExpanded: true };
      }
      return null;
    }).filter(g => g !== null) as ScheduledGroup[];
  });

  onGlobalClick(target: HTMLElement): void {
    if (!target.closest('.action-menu-container')) {
      this.closeActionMenu();
    }
  }

  toggleGroup(groupId: string): void {
    this.groups.update(groups => 
      groups.map(g => g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g)
    );
  }

  toggleActionMenu(id: string): void {
    this.openActionMenuId.update(currentId => (currentId === id ? null : id));
  }

  closeActionMenu(): void {
    this.openActionMenuId.set(null);
  }

  openCreateModal(): void {
    this.newTaskName.set('');
    this.newTaskReservation.set('');
    this.newTaskDescription.set('');
    this.newTaskStatus.set('Enabled');
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  openTaskDetailModal(): void {
    this.isTaskDetailModalOpen.set(true);
  }

  closeTaskDetailModal(): void {
    this.isTaskDetailModalOpen.set(false);
  }

  saveTaskDetail(): void {
    // Add logic here to save task details if needed
    this.closeTaskDetailModal();
  }

  saveNewTask(): void {
    if (!this.newTaskName().trim()) return;
    
    // Add to the first group for demonstration
    this.groups.update(groups => {
      if (groups.length === 0) return groups;
      const firstGroup = groups[0];
      const newTask: ScheduledTask = {
        id: `task-${Date.now()}`,
        status: this.newTaskStatus(),
        action: this.newTaskName(), // using name as action for demo
        recurring: 'No',
        objectName: this.newTaskReservation() || 'N/A',
        type: 'Custom',
        startEndDate: 'Pending',
        recurringTime: 'N/A',
        maxCount: 1
      };
      return [
        { ...firstGroup, tasks: [newTask, ...firstGroup.tasks] },
        ...groups.slice(1)
      ];
    });

    this.closeCreateModal();
  }

  handleDeleteTask(groupId: string, taskId: string): void {
    this.taskToDelete.set({groupId, taskId});
    this.isDeleteModalOpen.set(true);
    this.closeActionMenu();
  }

  handleConfirmDelete(): void {
    const target = this.taskToDelete();
    if (target) {
        this.groups.update(groups => groups.map(g => {
          if (g.id === target.groupId) {
            return { ...g, tasks: g.tasks.filter(t => t.id !== target.taskId) };
          }
          return g;
        }));
    }
    this.isDeleteModalOpen.set(false);
    this.taskToDelete.set(null);
  }

  toggleTaskStatus(groupId: string, taskId: string, event: boolean): void {
    this.groups.update(groups => groups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          tasks: g.tasks.map(t => t.id === taskId ? { ...t, status: event ? 'Enabled' : 'Disabled' } : t)
        };
      }
      return g;
    }));
  }
}