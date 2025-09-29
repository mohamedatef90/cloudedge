
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
// FIX: Update the import path for reservation types. The types were being imported from the component file instead of the dedicated types file.
import { Plan, PlanAddon, ALL_ADDONS, AddonName } from '../../reservation.types';

@Component({
  selector: 'app-create-reservation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './create-reservation-modal.component.html',
  styleUrls: ['./create-reservation-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationModalComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  create = output<{ name: string; plan: Plan; durationInYears: number }>();

  // FIX: Updated plan names to match 'FixedPlanName' type from reservation.types.ts to resolve type errors.
  readonly FIXED_PLANS: Plan[] = [
    { id: 'plan-standard', name: 'General Purpose', type: 'Fixed', cores: 4, ram: 8, storage: 100, price: 75, addons: ALL_ADDONS.map(name => ({ name, included: ['Public IPs', 'Advanced Backup by Veeam'].includes(name), quantity: name === 'Public IPs' ? 1 : undefined, })) },
    { id: 'plan-performance', name: 'Compute Optimized', type: 'Fixed', cores: 8, ram: 32, storage: 500, price: 250, addons: ALL_ADDONS.map(name => ({ name, included: ['Public IPs', 'Advanced Backup by Veeam', 'Cortex XDR Endpoint Protection / VM', 'Load Balancer/ IP'].includes(name), quantity: name === 'Public IPs' ? 2 : undefined, })) }
  ];

  // FIX: Updated signal type and initial value to align with valid plan names.
  activePlanTab = signal<'General Purpose' | 'Compute Optimized' | 'Custom'>('General Purpose');
  reservationName = signal('');
  durationInYears = signal(1);

  // Custom plan state
  customPlanCores = signal(8);
  customPlanRam = signal(16);
  customPlanStorage = signal(250);
  customPlanAddons = signal<PlanAddon[]>(ALL_ADDONS.map(name => ({ name, included: false })));

  customPlanPrice = computed(() => {
    const corePrice = this.customPlanCores() * 5;
    const ramPrice = this.customPlanRam() * 2.5;
    const storagePrice = this.customPlanStorage() * 0.1;
    const addonsPrice = this.customPlanAddons().reduce((total, addon) => {
        if (addon.included) {
            // Mock pricing for addons
            if(addon.name === 'Public IPs') return total + (addon.quantity || 1) * 5;
            if(addon.name === 'Windows Enterprise Licenses') return total + 15;
            return total + 10;
        }
        return total;
    }, 0);
    return corePrice + ramPrice + storagePrice + addonsPrice;
  });

  fixedPlanPrice = computed(() => {
    const activeTab = this.activePlanTab();
    if (activeTab === 'Custom') {
      return 0;
    }
    const selectedPlan = this.FIXED_PLANS.find(p => p.name === activeTab);
    return selectedPlan?.price ?? 0;
  });

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.resetForm();
      }
    });
  }
  
  resetForm(): void {
    // FIX: Updated to set a valid plan name.
    this.activePlanTab.set('General Purpose');
    this.reservationName.set('');
    this.durationInYears.set(1);
    this.customPlanCores.set(8);
    this.customPlanRam.set(16);
    this.customPlanStorage.set(250);
    this.customPlanAddons.set(ALL_ADDONS.map(name => ({ name, included: false })));
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
    if (this.activePlanTab() === 'Custom') {
      selectedPlan = {
        id: `plan-custom-${Date.now()}`, name: 'Custom', type: 'Custom',
        cores: this.customPlanCores(), ram: this.customPlanRam(), storage: this.customPlanStorage(),
        addons: this.customPlanAddons(), price: this.customPlanPrice()
      };
    } else {
      selectedPlan = this.FIXED_PLANS.find(p => p.name === this.activePlanTab())!;
    }
    
    this.create.emit({
      name: this.reservationName(),
      plan: selectedPlan,
      durationInYears: this.durationInYears()
    });
  }
}
