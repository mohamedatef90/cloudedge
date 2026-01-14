

import { ChangeDetectionStrategy, Component, computed, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { ViewMembersModalComponent } from './components/view-members-modal/view-members-modal.component';
import { EditSourceDestModalComponent } from './components/edit-source-dest-modal/edit-source-dest-modal.component';
import { EditAppliedToModalComponent } from './components/edit-applied-to-modal/edit-applied-to-modal.component';
import { RelatedGroupsModalComponent } from './components/related-groups-modal/related-groups-modal.component';
import { AddPolicyModalComponent } from './components/add-policy-modal/add-policy-modal.component';
import { EditServicesModalComponent } from './components/edit-services-modal/edit-services-modal.component';
import { EditRuleAppliedToModalComponent } from './components/edit-rule-applied-to-modal/edit-rule-applied-to-modal.component';
import { AppliedToDisplayComponent } from './components/applied-to-display/applied-to-display.component';
import { FirewallPolicy, FirewallRule, GroupData, SelectableGroup, Service } from './types';
import { mockPoliciesData, mockGroupData, mockAvailableGroupsForSelection, mockAvailableServices } from './mock-data';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';

@Component({
  selector: 'app-distributed-firewall',
  templateUrl: './distributed-firewall.component.html',
  styleUrls: ['./distributed-firewall.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    ToggleSwitchComponent,
    AdvancedDeleteConfirmationModalComponent,
    ViewMembersModalComponent,
    EditSourceDestModalComponent,
    EditAppliedToModalComponent,
    RelatedGroupsModalComponent,
    AddPolicyModalComponent,
    EditServicesModalComponent,
    EditRuleAppliedToModalComponent,
    AppliedToDisplayComponent,
  ],
  host: {
    '(document:mousedown)': 'onGlobalClick($event)',
  },
})
export class DistributedFirewallComponent {
  // Main state
  policies = signal<FirewallPolicy[]>(mockPoliciesData);
  selectedItems = signal<string[]>([]);
  
  // Available data for modals
  availableGroups = signal<SelectableGroup[]>(mockAvailableGroupsForSelection);
  availableServices = signal<{ name: string; icon: string }[]>(mockAvailableServices);

  // New rule state
  addingRuleToPolicyId = signal<string | null>(null);
  newRuleForm = signal(this.getInitialNewRuleState());

  // Modal states
  isDeleteModalOpen = signal(false);
  isViewMembersModalOpen = signal(false);
  viewingGroup = signal<GroupData | null>(null);
  isAddPolicyModalOpen = signal(false);
  isRelatedGroupsModalOpen = signal(false);
  viewingRelatedGroup = signal<SelectableGroup | null>(null);

  editSourceDestModalState = signal<{ isOpen: boolean; rule: FirewallRule | null; policyId: string | null; field: 'sources' | 'destinations' | null; isNewRule?: boolean }>({ isOpen: false, rule: null, policyId: null, field: null });
  editAppliedToModalState = signal<{ isOpen: boolean; policy: FirewallPolicy | null }>({ isOpen: false, policy: null });
  editServicesModalState = signal<{ isOpen: boolean; rule: FirewallRule | null; policyId: string | null }>({ isOpen: false, rule: null, policyId: null });
  editRuleAppliedToModalState = signal<{ isOpen: boolean; rule: FirewallRule | null; policy: FirewallPolicy | null }>({ isOpen: false, rule: null, policy: null });
  modalSource = signal<'sourceDest' | 'appliedTo' | 'ruleAppliedTo' | null>(null);

  isActionsMenuOpen = signal(false);
  actionsMenuRef = viewChild<ElementRef>('actionsMenuRef');
  actionsButtonRef = viewChild<ElementRef>('actionsButtonRef');

  // Computed properties
  isSelectionEmpty = computed(() => this.selectedItems().length === 0);
  isSingleSelection = computed(() => this.selectedItems().length === 1);
  isSinglePolicySelected = computed(() => {
    if (!this.isSingleSelection()) return false;
    const selectedId = this.selectedItems()[0];
    return this.policies().some(p => p.id === selectedId);
  });

  constructor() {
    effect(() => {
      // Auto-expand policy when adding a new rule to it
      const policyId = this.addingRuleToPolicyId();
      if (policyId) {
        const policy = this.policies().find(p => p.id === policyId);
        if (policy && !policy.isExpanded) {
          this.togglePolicy(policyId);
        }
      }
    });
  }

  onGlobalClick(event: MouseEvent): void {
      if (
          this.isActionsMenuOpen() &&
          this.actionsMenuRef() && !this.actionsMenuRef()!.nativeElement.contains(event.target as Node) &&
          this.actionsButtonRef() && !this.actionsButtonRef()!.nativeElement.contains(event.target as Node)
      ) {
          this.isActionsMenuOpen.set(false);
      }
  }

  getInitialNewRuleState() {
    return {
      name: '',
      sources: 'Any',
      destinations: 'Any',
      services: [{ name: 'Any', icon: 'fas fa-asterisk' }],
      action: 'Allow' as 'Allow' | 'Deny' | 'Drop',
      enabled: true,
      contextProfiles: 'None',
      appliedTo: 'DFW'
    };
  }

  // --- Main Actions ---

  handleAddPolicyClick(): void {
    this.isAddPolicyModalOpen.set(true);
  }

  handleSaveNewPolicy(policyName: string): void {
    const newPolicy: FirewallPolicy = {
      id: `policy-${Date.now()}`,
      name: policyName,
      policyId: '(0)',
      appliedTo: 'DFW',
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

    const newRule: FirewallRule = {
      id: `rule-${Date.now()}`,
      ruleId: String(Math.floor(Math.random() * 100) + 10),
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

  // --- Table Interactions ---

  togglePolicy(policyId: string): void {
    this.policies.update(ps => ps.map(p => p.id === policyId ? { ...p, isExpanded: !p.isExpanded } : p));
  }
  
  handleSelect(id: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedItems.update(prev => 
      isChecked ? [...prev, id] : prev.filter(i => i !== id)
    );
  }

  handleRuleUpdate(policyId: string, ruleId: string, field: keyof Omit<FirewallRule, 'id' | 'ruleId'>, value: any): void {
    this.policies.update(ps => ps.map(p => {
        if (p.id === policyId) {
            return { ...p, rules: p.rules.map(r => r.id === ruleId ? { ...r, [field]: value } : r) };
        }
        return p;
    }));
  }

  handlePolicyUpdate(policyId: string, field: keyof Omit<FirewallPolicy, 'id' | 'rules'>, value: any): void {
      this.policies.update(ps => ps.map(p => p.id === policyId ? { ...p, [field]: value } : p));
  }
  
  getServiceNames(services: Service[]): string {
    return services.map(s => s.name).join(', ');
  }

  handleNewRuleEnabledChange(enabled: boolean): void {
    this.newRuleForm.update(form => ({ ...form, enabled }));
  }

  // --- Modal Opening ---

  handleOpenViewMembersModal(groupName: string, source: 'sourceDest' | 'appliedTo' | 'ruleAppliedTo'): void {
    const groupData = mockGroupData[groupName];
    if (groupData) {
      this.viewingGroup.set(groupData);
      if (source === 'sourceDest') {
        this.editSourceDestModalState.update(s => ({ ...s, isOpen: false }));
      } else if (source === 'appliedTo') {
        this.editAppliedToModalState.update(s => ({ ...s, isOpen: false }));
      } else { // ruleAppliedTo
        this.editRuleAppliedToModalState.update(s => ({ ...s, isOpen: false }));
      }
      this.isViewMembersModalOpen.set(true);
      this.modalSource.set(source);
    }
  }

  handleOpenRelatedGroupsModal(group: SelectableGroup): void {
    this.viewingRelatedGroup.set(group);
    this.isRelatedGroupsModalOpen.set(true);
  }
  
  handleOpenEditSourceDestModal(rule: FirewallRule, policyId: string, field: 'sources' | 'destinations'): void {
    this.editSourceDestModalState.set({ isOpen: true, rule, policyId, field });
  }

  handleOpenEditSourceDestModalForNewRule(field: 'sources' | 'destinations'): void {
    const policyId = this.addingRuleToPolicyId();
    if (!policyId) return;
    const formState = this.newRuleForm();
    const tempRule: FirewallRule = { id: 'new-rule', ruleId: 'new', ...formState };
    this.editSourceDestModalState.set({ isOpen: true, rule: tempRule, policyId, field, isNewRule: true });
  }

  handleOpenEditAppliedToModal(policy: FirewallPolicy): void {
    this.editAppliedToModalState.set({ isOpen: true, policy });
  }

  handleOpenEditServicesModal(rule: FirewallRule, policyId: string): void {
    this.editServicesModalState.set({ isOpen: true, rule, policyId });
  }

  handleOpenEditRuleAppliedToModal(rule: FirewallRule, policy: FirewallPolicy): void {
    this.editRuleAppliedToModalState.set({ isOpen: true, rule, policy });
  }

  // --- Modal Save/Close Handlers ---
  
  handleCloseViewMembersModal(): void {
    this.isViewMembersModalOpen.set(false);
    const source = this.modalSource();
    if (source === 'sourceDest') {
        this.editSourceDestModalState.update(s => ({ ...s, isOpen: true }));
    } else if (source === 'appliedTo') {
        this.editAppliedToModalState.update(s => ({ ...s, isOpen: true }));
    } else if (source === 'ruleAppliedTo') {
        this.editRuleAppliedToModalState.update(s => ({ ...s, isOpen: true }));
    }
    this.modalSource.set(null);
  }

  handleSaveSourceDest(newValue: string): void {
    const state = this.editSourceDestModalState();
    if (!state.field) return;

    if (state.isNewRule) {
      this.newRuleForm.update(form => ({ ...form, [state.field!]: newValue }));
    } else if (state.rule && state.policyId) {
      this.handleRuleUpdate(state.policyId, state.rule.id, state.field, newValue);
    }
    this.editSourceDestModalState.set({ isOpen: false, rule: null, policyId: null, field: null });
  }

  handleSaveAppliedTo(data: { policyId: string, newAppliedTo: string }): void {
    this.handlePolicyUpdate(data.policyId, 'appliedTo', data.newAppliedTo);
    this.editAppliedToModalState.set({ isOpen: false, policy: null });
  }

  handleSaveServices(newServices: Service[]): void {
    const state = this.editServicesModalState();
    if (state.rule && state.policyId) {
        this.handleRuleUpdate(state.policyId, state.rule.id, 'services', newServices);
    }
    this.editServicesModalState.set({ isOpen: false, rule: null, policyId: null });
  }

  handleSaveRuleAppliedTo(data: { policyId: string; ruleId: string; newAppliedTo: string }): void {
    this.handleRuleUpdate(data.policyId, data.ruleId, 'appliedTo', data.newAppliedTo);
    this.editRuleAppliedToModalState.set({ isOpen: false, rule: null, policy: null });
  }

  handleAddNewGroup(newGroup: SelectableGroup): void {
    this.availableGroups.update(prev => [newGroup, ...prev]);
  }
  
}