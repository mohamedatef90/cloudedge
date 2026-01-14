import { Injectable, computed, inject } from '@angular/core';
import { ReservationService } from '../reservations/reservation.service';
import { VirtualMachineService } from '../virtual-machines/services/virtual-machine.service';
import { GatewayService } from '../gateways/gateway.service';
import { mockPoliciesData } from '../distributed-firewall/mock-data';

@Injectable({ providedIn: 'root' })
export class GettingStartedService {
  private reservationService = inject(ReservationService);
  private virtualMachineService = inject(VirtualMachineService);
  private gatewayService = inject(GatewayService);

  completionStatus = computed(() => {
    return {
      'create-reservation': this.reservationService.reservations().length > 0,
      'create-vm': this.virtualMachineService.virtualMachines().length > 0,
      'configure-network': this.gatewayService.gateways().length > 0,
      'secure-environment': mockPoliciesData.length > 0,
      'add-storage': true, // Mocking this as complete since data is local to component
      'join-community': false, // Cannot be tracked automatically
    };
  });
}
