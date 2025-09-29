import { Injectable, signal } from '@angular/core';
import { VirtualMachine, VIRTUAL_MACHINES_DATA } from '../mock-data';

@Injectable({
  providedIn: 'root',
})
export class VirtualMachineService {
  private virtualMachinesState = signal<VirtualMachine[]>(VIRTUAL_MACHINES_DATA);

  virtualMachines = this.virtualMachinesState.asReadonly();

  addVm(newVmConfig: { 
    name: string; 
    os: 'windows' | 'ubuntu' | 'linux'; 
    cores: number; 
    memory: number; 
    storage: number; 
    description: string; 
  }) {
    const newVm: VirtualMachine = {
      id: `vm-${Date.now()}`,
      name: newVmConfig.name,
      os: newVmConfig.os,
      cores: newVmConfig.cores,
      memory: newVmConfig.memory,
      storage: newVmConfig.storage,
      description: newVmConfig.description,
      nicCount: 1, // default
      ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`, // random IP for demo
      reservationName: null, // from marketplace, so no reservation initially
      creationDate: new Date().toISOString().split('T')[0],
      status: 'running'
    };

    this.virtualMachinesState.update(vms => [newVm, ...vms]);
  }
}
