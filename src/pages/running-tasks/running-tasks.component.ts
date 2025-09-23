
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-running-tasks',
  templateUrl: './running-tasks.component.html',
  styleUrls: ['./running-tasks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningTasksComponent {}
