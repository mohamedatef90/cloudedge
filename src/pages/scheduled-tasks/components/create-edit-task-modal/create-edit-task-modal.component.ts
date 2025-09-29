
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { ScheduledTask } from '../../scheduled-tasks.component';

type TaskFormData = Omit<ScheduledTask, 'id' | 'lastRun' | 'nextRun'>;

@Component({
  selector: 'app-create-edit-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
  templateUrl: './create-edit-task-modal.component.html',
  styleUrls: ['./create-edit-task-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditTaskModalComponent {
  isOpen = input.required<boolean>();
  taskToEdit = input<ScheduledTask | null>();

  close = output<void>();
  save = output<TaskFormData>();

  taskData = signal<TaskFormData>({ name: '', targetResource: '', action: 'Stop VM', schedule: '', status: 'Enabled' });
  isEditMode = computed(() => !!this.taskToEdit());
  
  // Mock data for dropdowns
  readonly targetResources = ['All Dev VMs', 'All Production VMs', 'sql-database-main', 'prod-web-server-01'];
  readonly actions: ScheduledTask['action'][] = ['Start VM', 'Stop VM', 'Create Snapshot', 'Run Script'];

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const task = this.taskToEdit();
        if (task) {
          this.taskData.set({
            name: task.name,
            targetResource: task.targetResource,
            action: task.action,
            schedule: task.schedule,
            status: task.status,
          });
        } else {
          // Reset for new task
          this.taskData.set({ name: '', targetResource: '', action: 'Stop VM', schedule: '', status: 'Enabled' });
        }
      }
    });
  }
  
  onSave(): void {
    const data = this.taskData();
    if(data.name.trim() && data.targetResource.trim() && data.schedule.trim()) {
      this.save.emit(data);
    }
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  handleStatusChange(enabled: boolean): void {
    this.taskData.update(d => ({ ...d, status: enabled ? 'Enabled' : 'Disabled' }));
  }
}
