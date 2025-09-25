
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { VmCardViewComponent } from './components/vm-card-view/vm-card-view.component';
import { VmTableViewComponent } from './components/vm-table-view/vm-table-view.component';
import { VirtualMachine, VIRTUAL_MACHINES_DATA } from './mock-data';

@Component({
  selector: 'app-virtual-machines',
  templateUrl: './virtual-machines.component.html',
  styleUrls: ['./virtual-machines.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, VmCardViewComponent, VmTableViewComponent, RouterModule],
})
export class VirtualMachinesComponent {
  viewMode = signal<'card' | 'table'>('card');

  virtualMachines = signal<VirtualMachine[]>(VIRTUAL_MACHINES_DATA);

  setViewMode(mode: 'card' | 'table'): void {
    this.viewMode.set(mode);
  }
}
