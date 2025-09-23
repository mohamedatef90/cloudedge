
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsComponent {}
