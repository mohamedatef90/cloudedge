
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-virtual-machines',
  templateUrl: './virtual-machines.component.html',
  styleUrls: ['./virtual-machines.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualMachinesComponent {}
