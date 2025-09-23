
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-action-logs',
  templateUrl: './action-logs.component.html',
  styleUrls: ['./action-logs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionLogsComponent {}
