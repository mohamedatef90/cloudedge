
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesComponent {}
