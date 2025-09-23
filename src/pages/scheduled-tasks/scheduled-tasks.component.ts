
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-scheduled-tasks',
  templateUrl: './scheduled-tasks.component.html',
  styleUrls: ['./scheduled-tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduledTasksComponent {}
