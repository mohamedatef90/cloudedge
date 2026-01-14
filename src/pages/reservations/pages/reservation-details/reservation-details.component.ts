import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { IconComponent } from '../../../../components/icon/icon.component';
import { ReservationService } from '../../reservation.service';
import { VirtualMachineService } from '../../../virtual-machines/services/virtual-machine.service';
import { AddonName, Reservation } from '../../reservation.types';
import { VirtualMachine } from '../../../virtual-machines/mock-data';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationDetailsComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private reservationService = inject(ReservationService);
  private vmService = inject(VirtualMachineService);

  private reservationId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  reservation = computed(() => {
    const id = this.reservationId();
    if (!id) return null;
    return this.reservationService.getReservationById(id);
  });

  associatedVms = computed(() => {
    const resName = this.reservation()?.name;
    if (!resName) return [];
    return this.vmService.virtualMachines().filter(vm => vm.reservationName === resName);
  });
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getStatusClass(status: Reservation['status']): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  }
  
  getVmStatusClass(status: VirtualMachine['status']): string {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'stopped': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  }

  getAddonIcon(addonName: AddonName): string {
    const iconMap: Record<AddonName, string> = {
      'Windows Enterprise Licenses': 'fab fa-windows',
      'Linux Enterprise Licenses': 'fab fa-linux',
      'Cortex XDR Endpoint Protection / VM': 'fas fa-shield-virus',
      'Public IPs': 'fas fa-globe',
      'Load Balancer/ IP': 'fas fa-network-wired',
      'Advanced Backup by Veeam': 'fas fa-save',
      'Trend Micro Deep Security/ VM': 'fas fa-shield-halved'
    };
    return iconMap[addonName];
  }
}
