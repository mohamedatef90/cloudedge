import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { FirewallPolicy, FirewallRule, GroupData, SelectableGroup, Service } from '../../../distributed-firewall/types';
import { mockAvailableGroupsForSelection, mockAvailableServices, mockGroupData } from '../../../distributed-firewall/mock-data';
import { MOCK_IDS_IPS_PROFILES_DATA } from '../../../ids-ips-malware-prevention/mock-data';

import { EditSourceDestModalComponent } from '../../../distributed-firewall/components/edit-source-dest-modal/edit-source-dest-modal.component';
import { EditServicesModalComponent } from '../../../distributed-firewall/components/edit-services-modal/edit-services-modal.component';
import { EditProfilesModalComponent } from '../../../gateway-firewall/components/edit-profiles-modal/edit-profiles-modal.component';
import { EditRuleAppliedToModalComponent } from '../../../distributed-firewall/components/edit-rule-applied-to-modal/edit-rule-applied-to-modal.component';
import { ViewMembersModalComponent } from '../../../distributed-firewall/components/view-members-modal/view-members-modal.component';
import { RelatedGroupsModalComponent } from '../../../distributed-firewall/components/related-groups-modal/related-groups-modal.component';

@Component({
  selector: 'app-add-dfw-old-policy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    EditSourceDestModalComponent,
    EditServicesModalComponent,
    EditProfilesModalComponent,
    EditRuleAppliedToModalComponent,
    ViewMembersModalComponent,
    RelatedGroupsModalComponent
  ],
  templateUrl: './add-dfw-old-policy.component.html',
  styleUrls: ['./add-dfw-old-policy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDfwOldPolicyComponent {
  private router = inject(Router);

  policyName = signal('');
  rules = signal<Partial<FirewallRule>[]>([]);

  // Modal states
  editSourceDestModalState = signal<{ isOpen: boolean; rule: Partial<FirewallRule> | null; field: 'sources' | 'destinations' | null; ruleIndex: number | null }>({ isOpen: false, rule: null, field: null, ruleIndex: null });
  editServicesModalState = signal<{ isOpen: boolean; rule: Partial<FirewallRule> | null; ruleIndex: number | null }>({ isOpen: false, rule: null, ruleIndex: null });
  editProfilesModalState = signal<{ isOpen: boolean; rule: Partial<FirewallRule> | null; ruleIndex: number | null }>({ isOpen: false, rule: null, ruleIndex: null });
  editAppliedToModalState = signal<{ isOpen: boolean; rule: Partial<FirewallRule> | null; ruleIndex: number | null }>({ isOpen: false, rule: null, ruleIndex: null });
  isViewMoreModalOpen = signal(false);
  viewMoreModalTitle = signal('');
  viewMoreModalItems = signal<string[]>([]);

  isViewMembersModalOpen = signal(false);
  viewingGroup = signal<GroupData | null>(null);
  isRelatedGroupsModalOpen = signal(false);
  viewingRelatedGroup = signal<SelectableGroup | null>(null);

  // Data for modals
  availableGroups = signal<SelectableGroup[]>(mockAvailableGroupsForSelection);
  availableServices = signal<Service[]>(mockAvailableServices);
  availableProfiles = signal<string[]>(['None', ...MOCK_IDS_IPS_PROFILES_DATA.map(p => p.name)]);
  
  newPolicyName = computed(() => this.policyName() || 'New Policy');

  addRule() {
    const newRule: Partial<FirewallRule> = {
      id: `new-rule-${this.rules().length}`,
      name: `New Rule ${this.rules().length + 1}`,
      sources: 'DefaultMaliciousIpGroup, Edge_NSGroup, f31e1b66-29e3-4ff2-a5bc-5233fd1a891a, Web Servers Group, DB Servers Group, App Servers Group',
      destinations: 'Web Servers Group, DB Servers Group, App Servers Group, Admin IP Group, Mgmt Group',
      services: [{ name: 'HTTP', icon: 'fas fa-globe' }, { name: 'HTTPS', icon: 'fas fa-lock' }, { name: 'SSH', icon: 'fas fa-terminal' }, { name: 'MySQL', icon: 'fas fa-database' }, { name: 'DHCP-Server', icon: 'fas fa-cog' }],
      contextProfiles: 'DefaultIDSProfile',
      appliedTo: 'DFW, Edge_NSGroup',
      action: 'Allow',
      enabled: true,
      status: 'Success'
    };
    this.rules.update(rules => [...rules, newRule]);
  }

  removeRule(ruleId: string) {
    this.rules.update(rules => rules.filter(r => r.id !== ruleId));
  }
  
  getDisplayItems(value: string | undefined): string[] {
    if (!value) return [];
    return value.split(',').map(item => item.trim());
  }

  isIpAddress(value: string): boolean {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(value);
  }

  getServiceNamesArray(services: Service[] | undefined): string[] {
    if (!services) return [];
    return services.map(s => s.name);
  }

  // --- Modal Openers ---
  openEditSourceDestModal(rule: Partial<FirewallRule>, ruleIndex: number, field: 'sources' | 'destinations') {
    this.editSourceDestModalState.set({ isOpen: true, rule, field, ruleIndex });
  }

  openEditServicesModal(rule: Partial<FirewallRule>, ruleIndex: number) {
    this.editServicesModalState.set({ isOpen: true, rule, ruleIndex });
  }

  openEditProfilesModal(rule: Partial<FirewallRule>, ruleIndex: number) {
    this.editProfilesModalState.set({ isOpen: true, rule, ruleIndex });
  }

  openEditAppliedToModal(rule: Partial<FirewallRule>, ruleIndex: number) {
    this.editAppliedToModalState.set({ isOpen: true, rule, ruleIndex });
  }

  openViewMoreModal(title: string, items: string | Service[] | undefined) {
    if (!items) return;

    let itemArray: string[] = [];
    if (typeof items === 'string') {
        itemArray = this.getDisplayItems(items) || [];
    } else if (Array.isArray(items)) {
        itemArray = this.getServiceNamesArray(items as Service[]);
    }

    this.viewMoreModalTitle.set(title);
    this.viewMoreModalItems.set(itemArray);
    this.isViewMoreModalOpen.set(true);
  }

  handleOpenViewMembersModal(groupName: string): void {
    const groupData = mockGroupData[groupName];
    if (groupData) {
      this.viewingGroup.set(groupData);
      this.isViewMembersModalOpen.set(true);
    }
  }

  handleOpenRelatedGroupsModal(group: SelectableGroup): void {
    this.viewingRelatedGroup.set(group);
    this.isRelatedGroupsModalOpen.set(true);
  }

  handleCloseViewMembersModal() {
    this.isViewMembersModalOpen.set(false);
  }
  
  handleAddNewGroup(newGroup: SelectableGroup) {
      this.availableGroups.update(groups => [newGroup, ...groups]);
  }

  // --- Modal Savers ---
  handleSaveSourceDest(value: string) {
    const { field, ruleIndex } = this.editSourceDestModalState();
    if (field !== null && ruleIndex !== null) {
      this.rules.update(rules => {
        const newRules = [...rules];
        newRules[ruleIndex] = { ...newRules[ruleIndex], [field]: value };
        return newRules;
      });
    }
    this.editSourceDestModalState.set({ isOpen: false, rule: null, field: null, ruleIndex: null });
  }

  handleSaveServices(services: Service[]) {
    const { ruleIndex } = this.editServicesModalState();
    if (ruleIndex !== null) {
      this.rules.update(rules => {
        const newRules = [...rules];
        newRules[ruleIndex] = { ...newRules[ruleIndex], services };
        return newRules;
      });
    }
    this.editServicesModalState.set({ isOpen: false, rule: null, ruleIndex: null });
  }

  handleSaveProfile(profiles: string[]) {
      const { ruleIndex } = this.editProfilesModalState();
      if (ruleIndex !== null) {
          this.rules.update(rules => {
              const newRules = [...rules];
              const profileValue = profiles.length > 0 ? profiles.join(', ') : 'None';
              newRules[ruleIndex] = { ...newRules[ruleIndex], contextProfiles: profileValue };
              return newRules;
          });
      }
      this.editProfilesModalState.set({ isOpen: false, rule: null, ruleIndex: null });
  }

  handleSaveAppliedTo(data: { policyId: string; ruleId: string; newAppliedTo: string }) {
      const { ruleIndex } = this.editAppliedToModalState();
      if (ruleIndex !== null) {
          this.rules.update(rules => {
              const newRules = [...rules];
              newRules[ruleIndex] = { ...newRules[ruleIndex], appliedTo: data.newAppliedTo };
              return newRules;
          });
      }
      this.editAppliedToModalState.set({ isOpen: false, rule: null, ruleIndex: null });
  }

  save() {
    console.log("Saving policy", this.policyName(), this.rules());
    // In real app, we would use a service to save this
    // For now, just navigate back
    this.router.navigate(['/app/cloud-edge/security/distributed-firewall-old']);
  }
  
  cancel() {
      this.router.navigate(['/app/cloud-edge/security/distributed-firewall-old']);
  }
}
