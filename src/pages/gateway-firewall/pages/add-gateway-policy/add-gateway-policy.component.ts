
import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { GatewayPolicy, GatewayRule } from '../../types';
import { Service, GroupData, SelectableGroup } from '../../../distributed-firewall/types';
import { mockAvailableGroupsForSelection, mockAvailableServices, mockGroupData } from '../../../distributed-firewall/mock-data';
import { MOCK_IDS_IPS_PROFILES_DATA } from '../../../ids-ips-malware-prevention/mock-data';
import { GatewayFirewallService } from '../../../../services/gateway-firewall.service';

import { EditSourceDestModalComponent } from '../../../distributed-firewall/components/edit-source-dest-modal/edit-source-dest-modal.component';
import { EditServicesModalComponent } from '../../../distributed-firewall/components/edit-services-modal/edit-services-modal.component';
import { EditProfilesModalComponent } from '../../components/edit-profiles-modal/edit-profiles-modal.component';
import { EditRuleAppliedToModalComponent } from '../../../distributed-firewall/components/edit-rule-applied-to-modal/edit-rule-applied-to-modal.component';
import { ViewMembersModalComponent } from '../../../distributed-firewall/components/view-members-modal/view-members-modal.component';
import { RelatedGroupsModalComponent } from '../../../distributed-firewall/components/related-groups-modal/related-groups-modal.component';

@Component({
  selector: 'app-add-gateway-policy',
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
  templateUrl: './add-gateway-policy.component.html',
  styleUrls: ['./add-gateway-policy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGatewayPolicyComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private gatewayService = inject(GatewayFirewallService);

  policyId = signal<string | null>(null);
  isEditMode = computed(() => !!this.policyId());
  policyName = signal('');
  rules = signal<Partial<GatewayRule>[]>([]);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.policyId.set(id);
      const policy = this.gatewayService.getPolicyById(id);
      if (policy) {
        this.policyName.set(policy.name);
        this.rules.set([...policy.rules]);
      }
    }
  }

  // Modal states
  editSourceDestModalState = signal<{ isOpen: boolean; rule: Partial<GatewayRule> | null; field: 'sources' | 'destinations' | null; ruleIndex: number | null }>({ isOpen: false, rule: null, field: null, ruleIndex: null });
  editServicesModalState = signal<{ isOpen: boolean; rule: Partial<GatewayRule> | null; ruleIndex: number | null }>({ isOpen: false, rule: null, ruleIndex: null });
  editProfilesModalState = signal<{ isOpen: boolean; rule: Partial<GatewayRule> | null; ruleIndex: number | null }>({ isOpen: false, rule: null, ruleIndex: null });
  editAppliedToModalState = signal<{ isOpen: boolean; rule: Partial<GatewayRule> | null; ruleIndex: number | null }>({ isOpen: false, rule: null, ruleIndex: null });
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
    const newRule: Partial<GatewayRule> = {
      id: `gw-rule-${this.rules().length}`,
      name: `New Rule ${this.rules().length + 1}`,
      sources: 'Any',
      destinations: 'Any',
      services: [{ name: 'Any', icon: 'fas fa-asterisk' }],
      profiles: 'None',
      appliedTo: 'Tier1-Gateway-01',
      action: 'Allow',
      enabled: true
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
  openEditSourceDestModal(rule: Partial<GatewayRule>, ruleIndex: number, field: 'sources' | 'destinations') {
    this.editSourceDestModalState.set({ isOpen: true, rule, field, ruleIndex });
  }

  openEditServicesModal(rule: Partial<GatewayRule>, ruleIndex: number) {
    this.editServicesModalState.set({ isOpen: true, rule, ruleIndex });
  }

  openEditProfilesModal(rule: Partial<GatewayRule>, ruleIndex: number) {
    this.editProfilesModalState.set({ isOpen: true, rule, ruleIndex });
  }

  openEditAppliedToModal(rule: Partial<GatewayRule>, ruleIndex: number) {
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
              newRules[ruleIndex] = { ...newRules[ruleIndex], profiles: profileValue };
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
    if (this.isEditMode()) {
      this.gatewayService.updatePolicy(this.policyId()!, {
        name: this.policyName(),
        rules: this.rules() as GatewayRule[]
      });
    } else {
      const newPolicy: GatewayPolicy = {
        id: `gw-policy-${Date.now()}`,
        name: this.policyName(),
        policyId: `(${Math.floor(Math.random() * 10)})`,
        rules: this.rules() as GatewayRule[],
        status: 'Success',
        isExpanded: false
      };
      this.gatewayService.addPolicy(newPolicy);
    }
    this.router.navigate(['/app/cloud-edge/security/gateway-firewall']);
  }
  
  cancel() {
      this.router.navigate(['/app/cloud-edge/security/gateway-firewall']);
  }
}
