
import { ChangeDetectionStrategy, Component, computed, signal, effect, ElementRef, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { ViewMembersModalComponent } from '../distributed-firewall/components/view-members-modal/view-members-modal.component';
import { EditSourceDestModalComponent } from '../distributed-firewall/components/edit-source-dest-modal/edit-source-dest-modal.component';
import { EditAppliedToModalComponent } from '../distributed-firewall/components/edit-applied-to-modal/edit-applied-to-modal.component';
import { RelatedGroupsModalComponent } from '../distributed-firewall/components/related-groups-modal/related-groups-modal.component';
import { EditServicesModalComponent } from '../distributed-firewall/components/edit-services-modal/edit-services-modal.component';
import { EditRuleAppliedToModalComponent } from '../distributed-firewall/components/edit-rule-applied-to-modal/edit-rule-applied-to-modal.component';
import { AppliedToDisplayComponent } from '../distributed-firewall/components/applied-to-display/applied-to-display.component';
import { FirewallPolicy, FirewallRule, GroupData, SelectableGroup, Service } from '../distributed-firewall/types';
import { mockPoliciesData, mockGroupData, mockAvailableGroupsForSelection, mockAvailableServices } from '../distributed-firewall/mock-data';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';

@Component({
  selector: 'app-distributed-firewall-old',
  templateUrl: './distributed-firewall-old.component.html',
  styleUrls: ['./distributed-firewall-old.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IconComponent,
    ToggleSwitchComponent,
    AdvancedDeleteConfirmationModalComponent,
    ViewMembersModalComponent,
    EditSourceDestModalComponent,
    EditAppliedToModalComponent,
    RelatedGroupsModalComponent,
    EditServicesModalComponent,
    EditRuleAppliedToModalComponent,
    AppliedToDisplayComponent,
  ],
})
export class DistributedFirewallOldComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Main state
  policies = signal<FirewallPolicy[]>(mockPoliciesData);

  // Modal states
  isDeletePolicyModalOpen = signal(false);
  policyToDelete = signal<FirewallPolicy | null>(null);
  isViewSourcesModalOpen = signal(false);
  sourcesToView = signal<string[]>([]);
  
  // A map to track open menus for each policy and rule
  openMenus = signal<{[key: string]: boolean}>({});

  filteredPolicies = computed(() => {
    return this.policies();
  });

  togglePolicy(policyId: string): void {
    this.policies.update(ps => ps.map(p => p.id === policyId ? { ...p, isExpanded: !p.isExpanded } : p));
  }
  
  toggleMenu(id: string): void {
      this.openMenus.update(menus => {
        const newMenus = { ...menus };
        newMenus[id] = !newMenus[id];
        return newMenus;
      })
  }

  getDisplayItems(value: string): string[] {
    if (!value) return [];
    return value.split(',').map(item => item.trim());
  }

  isIpAddress(value: string): boolean {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(value);
  }

  getServiceNames(services: Service[]): string {
    return services.map(s => s.name).join(', ');
  }

  public handleAddPolicyClick(): void {
    this.router.navigate(['add-policy'], { relativeTo: this.route });
  }

  handleEditPolicy(policy: FirewallPolicy): void {
    // For now, we just log it. A real implementation would open an edit modal or inline form.
    console.log('Editing policy:', policy.name);
    this.openMenus.update(menus => ({...menus, [policy.id]: false}));
  }

  handleDeletePolicy(policy: FirewallPolicy): void {
    this.policyToDelete.set(policy);
    this.isDeletePolicyModalOpen.set(true);
    this.openMenus.update(menus => ({...menus, [policy.id]: false}));
  }

  handleConfirmDeletePolicy(): void {
    const policy = this.policyToDelete();
    if (policy) {
        this.policies.update(policies => policies.filter(p => p.id !== policy.id));
    }
    this.isDeletePolicyModalOpen.set(false);
    this.policyToDelete.set(null);
  }

  openViewSourcesModal(sources: string): void {
    this.sourcesToView.set(this.getDisplayItems(sources));
    this.isViewSourcesModalOpen.set(true);
  }
}