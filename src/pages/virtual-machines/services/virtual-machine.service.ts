import { Injectable, signal } from '@angular/core';
import { VirtualMachine, VIRTUAL_MACHINES_DATA } from '../mock-data';

@Injectable({
  providedIn: 'root',
})
export class VirtualMachineService {
  private initialVms = VIRTUAL_MACHINES_DATA.filter(vm => vm.id !== 'vm-05');
  private initialRecycledVms = VIRTUAL_MACHINES_DATA.filter(vm => vm.id === 'vm-05').map(vm => ({...vm, deletedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()})); // 12 hours ago

  private virtualMachinesState = signal<VirtualMachine[]>(this.initialVms);
  private recycledVirtualMachinesState = signal<VirtualMachine[]>(this.initialRecycledVms);

  virtualMachines = this.virtualMachinesState.asReadonly();
  recycledVirtualMachines = this.recycledVirtualMachinesState.asReadonly();

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

  updateVmStatus(vmId: string, status: 'running' | 'stopped' | 'suspended'): void {
    this.virtualMachinesState.update(vms =>
      vms.map(vm => (vm.id === vmId ? { ...vm, status } : vm))
    );
  }

  deleteVm(vmId: string): void {
    const vmToDelete = this.virtualMachinesState().find(vm => vm.id === vmId);
    if (!vmToDelete) return;

    // Power off if running
    const finalVmState = vmToDelete.status === 'running' ? { ...vmToDelete, status: 'stopped' } : vmToDelete;
    
    // Move to recycled
    this.recycledVirtualMachinesState.update(recycled => [
      ...recycled,
      { ...finalVmState, deletedAt: new Date().toISOString() },
    ]);

    // Remove from active
    this.virtualMachinesState.update(vms => vms.filter(vm => vm.id !== vmId));
  }

  recoverVm(vmId: string): void {
    const vmToRecover = this.recycledVirtualMachinesState().find(vm => vm.id === vmId);
    if (!vmToRecover) return;

    this.recycledVirtualMachinesState.update(recycled => recycled.filter(vm => vm.id !== vmId));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { deletedAt, ...restoredVm } = vmToRecover;
    this.virtualMachinesState.update(vms => [...vms, restoredVm]);
  }

  permanentlyDeleteVm(vmId: string): void {
    this.recycledVirtualMachinesState.update(recycled => recycled.filter(vm => vm.id !== vmId));
  }
}