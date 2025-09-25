
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VirtualMachine } from '../../mock-data';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-vm-card-view',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  templateUrl: './vm-card-view.component.html',
  styleUrls: ['./vm-card-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class VmCardViewComponent {
  virtualMachines = input.required<VirtualMachine[]>();

  openMenuId = signal<string | null>(null);

  onGlobalClick(target: EventTarget | null): void {
    const clickedInside = (target as HTMLElement)?.closest('.vm-menu-container');
    if (!clickedInside) {
      this.openMenuId.set(null);
    }
  }

  toggleMenu(event: MouseEvent, vmId: string): void {
    event.stopPropagation();
    this.openMenuId.update(currentId => (currentId === vmId ? null : vmId));
  }

  getStatusClass(status: VirtualMachine['status']): string {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'stopped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getOsIcon(os: VirtualMachine['os']): string {
    switch (os) {
      case 'windows':
        return 'fab fa-windows text-blue-500';
      case 'ubuntu':
        return 'fab fa-ubuntu text-orange-500';
      case 'linux':
        return 'fab fa-linux text-gray-700 dark:text-gray-300';
    }
  }
}
