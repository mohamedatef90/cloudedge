import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';
import { VirtualMachineService } from '../virtual-machines/services/virtual-machine.service';
import { VirtualMachine } from '../virtual-machines/mock-data';
import { RouterModule } from '@angular/router';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';

@Component({
  selector: 'app-recycle-bin',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule, AdvancedDeleteConfirmationModalComponent],
  templateUrl: './recycle-bin.component.html',
  styleUrls: ['./recycle-bin.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecycleBinComponent {
  private vmService = inject(VirtualMachineService);
  recycledVms = this.vmService.recycledVirtualMachines;

  isDeleteModalOpen = signal(false);
  vmToPermanentlyDelete = signal<VirtualMachine | null>(null);

  getTimeRemaining(deletedAt: string | undefined): string {
    if (!deletedAt) return 'N/A';
    const deleteTime = new Date(deletedAt).getTime();
    const recoveryPeriod = 24 * 60 * 60 * 1000; // 24 hours
    const expiresAt = deleteTime + recoveryPeriod;
    const now = new Date().getTime();
    const remaining = expiresAt - now;

    if (remaining <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  }

  recoverVm(vmId: string): void {
    this.vmService.recoverVm(vmId);
  }

  requestPermanentDelete(vm: VirtualMachine): void {
    this.vmToPermanentlyDelete.set(vm);
    this.isDeleteModalOpen.set(true);
  }

  confirmPermanentDelete(): void {
    const vm = this.vmToPermanentlyDelete();
    if (vm) {
      this.vmService.permanentlyDeleteVm(vm.id);
    }
    this.isDeleteModalOpen.set(false);
    this.vmToPermanentlyDelete.set(null);
  }
}
