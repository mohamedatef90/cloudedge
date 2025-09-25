import { Injectable, signal } from '@angular/core';

interface Disk {
  name: string;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class VmCreationService {
  vmName = signal('');
  reservation = signal('');
  group = signal('');
  osBlueprint = signal('');
  hostName = signal('');
  password = signal('');
  gateway = signal('');
  cpu = signal(2);
  memory = signal(4);
  disks = signal<Disk[]>([{ name: 'Disk-01', size: 512 }]);
  description = signal('');

  reset(): void {
    this.vmName.set('');
    this.reservation.set('');
    this.group.set('');
    this.osBlueprint.set('');
    this.hostName.set('');
    this.password.set('');
    this.gateway.set('');
    this.cpu.set(2);
    this.memory.set(4);
    this.disks.set([{ name: 'Disk-01', size: 512 }]);
    this.description.set('');
  }
}
