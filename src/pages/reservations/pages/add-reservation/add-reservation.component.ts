
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { Plan, PlanAddon, AddonName, Reservation, FIXED_PLANS, FixedPlanName } from '../../reservation.types';
import { ReservationService } from '../../reservation.service';

@Component({
  selector: 'app-add-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, RouterModule],
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReservationComponent {
  // FIX: Explicitly type `Router` to prevent it from being inferred as `unknown`.
  private router: Router = inject(Router);
  private reservationService = inject(ReservationService);

  readonly FIXED_PLANS = FIXED_PLANS;

  activePlanTab = signal<FixedPlanName | 'Custom' | null>(null);
  reservationName = signal('');

  // Custom plan state
  customPlanCores = signal(8);
  customPlanRam = signal(16);
  customPlanStorage = signal(250);
  customPlanAddons = signal<PlanAddon[]>(this.getInitialAddons());

  isConfigVisible = signal(false);

  customPlanPrice = computed(() => {
    const corePrice = this.customPlanCores() * 5;
    const ramPrice = this.customPlanRam() * 2.5;
    const storagePrice = this.customPlanStorage() * 0.1;
    const addonsPrice = this.customPlanAddons().reduce((total, addon) => {
        if (addon.included) {
            if(addon.name === 'Public IPs') return total + (addon.quantity || 1) * 5;
            if(addon.name === 'Windows Enterprise Licenses') return total + 15;
            return total + 10;
        }
        return total;
    }, 0);
    return corePrice + ramPrice + storagePrice + addonsPrice;
  });

  get allAddons(): AddonName[] {
      return [
        'Windows Enterprise Licenses', 'Linux Enterprise Licenses', 'Cortex XDR Endpoint Protection / VM',
        'Public IPs', 'Load Balancer/ IP', 'Advanced Backup by Veeam', 'Trend Micro Deep Security/ VM'
      ];
  }

  getInitialAddons(): PlanAddon[] {
      return this.allAddons.map(name => ({ name, included: false }));
  }

  getAddonIcon(addonName: AddonName): string {
    const iconMap: Record<AddonName, string> = {
      'Windows Enterprise Licenses': 'fab fa-windows', 'Linux Enterprise Licenses': 'fab fa-linux',
      'Cortex XDR Endpoint Protection / VM': 'fas fa-shield-virus', 'Public IPs': 'fas fa-globe',
      'Load Balancer/ IP': 'fas fa-network-wired', 'Advanced Backup by Veeam': 'fas fa-save',
      'Trend Micro Deep Security/ VM': 'fas fa-shield-halved'
    };
    return iconMap[addonName];
  }
  
  selectPlan(planName: FixedPlanName | 'Custom'): void {
      this.activePlanTab.set(planName);
      this.isConfigVisible.set(true);
  }

  toggleCustomAddon(addonName: AddonName): void {
    this.customPlanAddons.update(addons =>
      addons.map(addon =>
        addon.name === addonName ? { ...addon, included: !addon.included } : addon
      )
    );
  }

  handleCreate(): void {
    if (!this.reservationName().trim()) return;

    let selectedPlan: Plan;
    const activePlan = this.activePlanTab();

    if (activePlan === 'Custom') {
      selectedPlan = {
        id: `plan-custom-${Date.now()}`, name: 'Custom', type: 'Custom',
        cores: this.customPlanCores(), ram: this.customPlanRam(), storage: this.customPlanStorage(),
        addons: this.customPlanAddons(), price: this.customPlanPrice()
      };
    } else {
      selectedPlan = this.FIXED_PLANS.find(p => p.name === activePlan)!;
    }
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1); // All reservations are for 1 year duration now

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      name: this.reservationName(),
      plan: selectedPlan,
      status: 'Pending',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    this.reservationService.addReservation(newReservation);
    this.router.navigate(['/app/cloud-edge/resources/reservations']);
  }
}
