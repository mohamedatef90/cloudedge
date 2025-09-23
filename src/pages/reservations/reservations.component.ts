
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsComponent {}
