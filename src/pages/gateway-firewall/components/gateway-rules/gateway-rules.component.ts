
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { MOCK_GATEWAY_POLICIES } from '../../mock-data';
import { GatewayPolicy, GatewayRule } from '../../types';
import { ActionDropdownComponent } from '../action-dropdown/action-dropdown.component';
import { EditableNameComponent } from '../editable-name/editable-name.component';
import { EditSourceDestModalComponent } from '../../../distributed-firewall/components/edit-source-dest-modal/edit-source-dest-modal.component';
import { EditServicesModalComponent } from '../../../distributed-firewall/components/edit-services-modal/edit-services-modal.component';
import { EditProfilesModalComponent } from '../edit-profiles-modal/edit-profiles-modal.component';
import { FirewallRule, GroupData, SelectableGroup, Service } from '../../../distributed-firewall/types';
import { mockAvailableGroupsForSelection, mockAvailableServices, mockGroupData } from '../../../distributed-firewall/mock-data';
import { MOCK_IDS_IPS_PROFILES_DATA } from '../../../ids-ips-malware-prevention/mock-data';
import { ViewMembersModalComponent } from '../../../distributed-firewall/components/view-members-modal/view-members-modal.component';
import { RelatedGroupsModalComponent } from '../../../distributed-firewall/components/related-groups-modal/related-groups-modal.component';
import { DeleteConfirmationModalComponent } from '../../../distributed-firewall/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { AddPolicyModalComponent } from '../../../distributed-firewall/components/add-policy-modal/add-policy-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gateway-rules',
  templateUrl: './gateway-rules.component.html',
  styleUrls: ['./gateway-rules.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    IconComponent, 
    ToggleSwitchComponent, 
    ActionDropdownComponent, 
    EditableNameComponent,
    EditSourceDestModalComponent,
    EditServicesModalComponent,
    EditProfilesModalComponent,
    ViewMembersModalComponent,
    RelatedGroupsModalComponent,
    DeleteConfirmationModalComponent,
    AddPolicyModalComponent,
    FormsModule
  ],
})
export class GatewayRulesComponent {
  policies = signal<GatewayPolicy[]>(MOCK_GATEWAY_POLICIES);
  selectedItems = signal<string[]>([]);

  // Modal states
  editSourceDestModalState = signal<{ isOpen: boolean; rule: FirewallRule | null; policyId: string | null; field: 'sources' | 'destinations' | null; isNewRule?: boolean }>({ isOpen: false, rule: null, policyId: null, field: null });
  editServicesModalState = signal<{ isOpen: boolean; rule: GatewayRule | null; policyId: string | null; isNewRule?: boolean }>({ isOpen: false, rule: null, policyId: null });
  editProfilesModalState = signal<{ isOpen: boolean; rule: GatewayRule | null; policyId: string | null; isNewRule?: boolean }>({ isOpen: false, rule: null, policyId: null });
  isViewMembersModalOpen = signal(false);
  viewingGroup = signal<GroupData | null>(null);
  isRelatedGroupsModalOpen = signal(false);
  viewingRelatedGroup = signal<SelectableGroup | null>(null);
  isDeleteModalOpen = signal(false);
  isAddPolicyModalOpen = signal(false);

  // New Rule State
  addingRuleToPolicyId = signal<string | null>(null);
  newRuleForm = signal(this.getInitialNewRuleState());

  // Data for modals
  availableGroups = signal<SelectableGroup[]>(mockAvailableGroupsForSelection);
  availableServices = signal<Service[]>(mockAvailableServices);
  availableProfiles = signal<string[]>(['None', ...MOCK_IDS_IPS_PROFILES_DATA.map(p => p.name)]);

  isSelectionEmpty = computed(() => this.selectedItems().length === 0);
  isSingleSelection = computed(() => this.selectedItems().length === 1);
  isSinglePolicySelected = computed(() => {
    const selected = this.selectedItems();
    if (selected.length !== 1) return false;
    return this.policies().some(p => p.id === selected[0]);
  });
  
  getInitialNewRuleState() {
    return {
      name: '',
      sources: 'Any',
      destinations: 'Any',
      services: [{ name: 'Any', icon: 'fas fa-asterisk' }],
      profiles: 'None',
      action: 'Allow' as 'Allow' | 'Drop' | 'Reject',
      enabled: true,
      appliedTo: 'Tier1-Gateway-01'
    };
  }
  
  togglePolicy(policyId: string): void {
    this.policies.update(currentPolicies => currentPolicies.map(p =>
      p.id === policyId ? { ...p, isExpanded: !p.isExpanded } : p
    ));
  }

  handleRuleActionChange(policyId: string, ruleId: string, newAction: 'Allow' | 'Drop' | 'Reject'): void {
    this.policies.update(prev => prev.map(p => {
      if (p.id === policyId) {
        const updatedRules = p.rules.map(r => 
          r.id === ruleId ? { ...r, action: newAction } : r
        );
        return { ...p, rules: updatedRules };
      }
      return p;
    }));
  }

  handleSelect(id: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedItems.update(prev => 
      isChecked ? [...prev, id] : prev.filter(i => i !== id)
    );
  }

  handlePolicyNameSave(policyId: string, newName: string): void {
      this.policies.update(ps => ps.map(p => p.id === policyId ? {...p, name: newName} : p));
  }

  handleRuleNameSave(policyId: string, ruleId: string, newName: string): void {
      this.policies.update(ps => ps.map(p => {
          if (p.id === policyId) {
              return {...p, rules: p.rules.map(r => r.id === ruleId ? {...r, name: newName} : r)}
          }
          return p;
      }));
  }

  handleRuleUpdate(policyId: string, ruleId: string, field: keyof Omit<GatewayRule, 'id' | 'ruleId'>, value: any): void {
    this.policies.update(ps => ps.map(p => {
        if (p.id === policyId) {
            return { ...p, rules: p.rules.map(r => r.id === ruleId ? { ...r, [field]: value } : r) };
        }
        return p;
    }));
  }

  getServiceNames(services: { name: string }[]): string {
    return services.map(s => s.name).join(', ');
  }

  // --- Main Actions ---

  handleAddPolicyClick(): void {
    this.isAddPolicyModalOpen.set(true);
  }

  handleSaveNewPolicy(policyName: string): void {
    const newPolicy: GatewayPolicy = {
      id: `gw-policy-${Date.now()}`,
      name: policyName,
      policyId: `(${Math.floor(Math.random() * 10)})`,
      status: 'Success',
      rules: [],
      isExpanded: true,
    };
    this.policies.update(prev => [newPolicy, ...prev]);
    this.selectedItems.set([newPolicy.id]);
    this.addingRuleToPolicyId.set(newPolicy.id);
    this.newRuleForm.set({ ...this.getInitialNewRuleState(), name: `New Rule in ${policyName}` });
    this.isAddPolicyModalOpen.set(false);
  }

  handleAddRuleClick(): void {
    if (this.isSinglePolicySelected()) {
      const policyId = this.selectedItems()[0];
      this.addingRuleToPolicyId.set(policyId);
      const policyName = this.policies().find(p => p.id === policyId)?.name || '';
      this.newRuleForm.set({ ...this.getInitialNewRuleState(), name: `New Rule in ${policyName}` });
    }
  }

  handleCancelNewRule(): void {
    this.addingRuleToPolicyId.set(null);
  }

  handleSaveNewRule(): void {
    const policyId = this.addingRuleToPolicyId();
    const formState = this.newRuleForm();
    if (!policyId || !formState.name.trim()) return;

    const newRule: GatewayRule = {
      id: `gw-rule-${Date.now()}`,
      ruleId: String(Math.floor(Math.random() * 100) + 1000),
      ...formState
    };

    this.policies.update(prev => prev.map(p =>
      p.id === policyId ? { ...p, rules: [newRule, ...p.rules] } : p
    ));
    this.handleCancelNewRule();
  }
  
  handleDeleteClick(): void {
    if (this.isSelectionEmpty()) return;
    this.isDeleteModalOpen.set(true);
  }

  handleConfirmDelete(): void {
    const selected = this.selectedItems();
    this.policies.update(prev => {
        const remainingPolicies = prev.filter(p => !selected.includes(p.id));
        return remainingPolicies.map(p => ({
            ...p,
            rules: p.rules.filter(r => !selected.includes(r.id))
        }));
    });
    this.selectedItems.set([]);
    this.isDeleteModalOpen.set(false);
  }

  // --- New Rule Form State Handlers ---
  handleNewRuleActionChange(newAction: 'Allow' | 'Drop' | 'Reject'): void {
    this.newRuleForm.update(form => ({ ...form, action: newAction }));
  }

  handleNewRuleEnabledChange(enabled: boolean): void {
    this.newRuleForm.update(form => ({ ...form, enabled }));
  }

  // --- Modal Opening ---

  handleOpenEditSourceDestModal(policyId: string, rule: GatewayRule, field: 'sources' | 'destinations'): void {
    const mappedRule: FirewallRule = {
        ...rule,
        contextProfiles: rule.profiles,
        action: 'Allow' // Placeholder
    };
    this.editSourceDestModalState.set({ isOpen: true, rule: mappedRule, policyId, field });
  }

  handleOpenEditSourceDestModalForNewRule(field: 'sources' | 'destinations'): void {
    const policyId = this.addingRuleToPolicyId();
    if (!policyId) return;
    const formState = this.newRuleForm();
    const tempRule: GatewayRule = { id: 'new-rule', ruleId: 'new', ...formState };
    const mappedRule: FirewallRule = { ...tempRule, contextProfiles: tempRule.profiles, action: 'Allow' };
    this.editSourceDestModalState.set({ isOpen: true, rule: mappedRule, policyId, field, isNewRule: true });
  }

  handleOpenEditServicesModal(policyId: string, rule: GatewayRule): void {
      this.editServicesModalState.set({ isOpen: true, rule, policyId });
  }

  handleOpenEditServicesModalForNewRule(): void {
    const policyId = this.addingRuleToPolicyId();
    if (!policyId) return;
    const formState = this.newRuleForm();
    const tempRule: GatewayRule = { id: 'new-rule', ruleId: 'new', ...formState };
    this.editServicesModalState.set({ isOpen: true, rule: tempRule, policyId, isNewRule: true });
  }

  handleOpenEditProfilesModal(policyId: string, rule: GatewayRule): void {
      this.editProfilesModalState.set({ isOpen: true, rule, policyId });
  }
  
  handleOpenEditProfilesModalForNewRule(): void {
    const policyId = this.addingRuleToPolicyId();
    if (!policyId) return;
    const formState = this.newRuleForm();
    const tempRule: GatewayRule = { id: 'new-rule', ruleId: 'new', ...formState };
    this.editProfilesModalState.set({ isOpen: true, rule: tempRule, policyId, isNewRule: true });
  }

  handleOpenViewMembersModal(groupName: string): void {
    const groupData = mockGroupData[groupName];
    if (groupData) {
      this.viewingGroup.set(groupData);
      this.editSourceDestModalState.update(s => ({ ...s, isOpen: false }));
      this.isViewMembersModalOpen.set(true);
    }
  }

  handleOpenRelatedGroupsModal(group: SelectableGroup): void {
    this.viewingRelatedGroup.set(group);
    this.isRelatedGroupsModalOpen.set(true);
  }

  handleCloseViewMembersModal(): void {
    this.isViewMembersModalOpen.set(false);
    this.editSourceDestModalState.update(s => ({ ...s, isOpen: true }));
  }

  handleAddNewGroup(newGroup: SelectableGroup): void {
    this.availableGroups.update(prev => [newGroup, ...prev]);
  }

  // --- Modal Save/Close Handlers ---
  
  handleSaveSourceDest(newValue: string): void {
    const state = this.editSourceDestModalState();
    if (!state.field) return;
    
    if (state.isNewRule) {
      this.newRuleForm.update(form => ({...form, [state.field!]: newValue}));
    } else if (state.rule && state.policyId) {
      this.handleRuleUpdate(state.policyId, state.rule.id, state.field, newValue);
    }
    this.editSourceDestModalState.set({ isOpen: false, rule: null, policyId: null, field: null });
  }

  handleSaveServices(newServices: Service[]): void {
      const state = this.editServicesModalState();
      if (state.isNewRule) {
        this.newRuleForm.update(form => ({ ...form, services: newServices }));
      } else if (state.rule && state.policyId) {
        this.handleRuleUpdate(state.policyId, state.rule.id, 'services', newServices);
      }
      this.editServicesModalState.set({ isOpen: false, rule: null, policyId: null });
  }

  handleSaveProfile(newProfile: string): void {
      const state = this.editProfilesModalState();
      if (state.isNewRule) {
        this.newRuleForm.update(form => ({ ...form, profiles: newProfile }));
      } else if (state.rule && state.policyId) {
        this.handleRuleUpdate(state.policyId, state.rule.id, 'profiles', newProfile);
      }
      this.editProfilesModalState.set({ isOpen: false, rule: null, policyId: null });
  }
}
