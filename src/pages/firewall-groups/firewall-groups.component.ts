import { ChangeDetectionStrategy, Component, signal, computed, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { ViewMembersModalComponent } from './components/view-members-modal/view-members-modal.component';
import { WhereUsedModalComponent } from './components/where-used-modal/where-used-modal.component';
import { DeleteGroupModalComponent } from './components/delete-group-modal/delete-group-modal.component';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel.component';

// --- TYPES AND MOCK DATA ---
export interface FirewallGroup {
  id: string;
  name: string;
  type: 'IP Addresses Only' | 'Generic';
  description: string;
  tags: number;
  isSystemDefined?: boolean;
  isLocked?: boolean;
  status: 'Success' | 'Pending' | 'Error';
}

export interface Member { [key: string]: string | number; }
export interface MemberCategory {
  id: string;
  name: string;
  count: number;
  members: Member[];
  headers: string[];
}
export interface GroupData {
  id: string;
  name: string;
  groupType: 'Generic' | 'IPSet';
  memberCategories: MemberCategory[];
}

export interface FilterState {
  type: 'all' | 'Generic' | 'IP Addresses Only';
  isSystemDefined: boolean;
  isLocked: boolean;
  status: 'all' | 'Success' | 'Pending' | 'Error';
}

const mockFirewallGroups: FirewallGroup[] = [
    { id: 'group1', name: 'DefaultMaliciousIpGroup', type: 'IP Addresses Only', description: 'Default Malicious IP group', tags: 0, isSystemDefined: true, status: 'Success' },
    { id: 'group2', name: 'Edge_NSGroup', type: 'Generic', description: 'NSX group for edge nodes', tags: 0, isLocked: true, status: 'Success' },
    { id: 'group3', name: 'f31e1b66-29e3-4ff2-a5bc-5233fd1a891a', type: 'Generic', description: 'Auto-generated application group', tags: 2, status: 'Success' },
    { id: 'group4', name: 'group from code', type: 'IP Addresses Only', description: 'Group managed via infrastructure-as-code', tags: 1, isSystemDefined: true, status: 'Pending' },
    { id: 'group5', name: 'MCA>Como>org>wdqwd', type: 'Generic', description: 'Group for Como org', tags: 0, status: 'Success' },
    { id: 'group6', name: 'MCA>rotest>org>bb', type: 'Generic', description: 'Test group for BB', tags: 0, status: 'Error' },
    { id: 'group7', name: 'MCA>protest>org>n', type: 'Generic', description: 'Test group for N', tags: 0, status: 'Success' },
    { id: 'group8', name: 'MCA>protest>org>rkjrjg', type: 'Generic', description: 'Test group for RKJRJG', tags: 0, status: 'Success' },
    { id: 'group9', name: 'MCA>sso11>sso11>Ahmed Mohamed Ra...', type: 'Generic', description: 'SSO group for Ahmed Mohamed', tags: 0, status: 'Pending' },
    { id: 'group10', name: 'MCA>sso11>sso11>sa', type: 'Generic', description: 'SSO group for SA', tags: 0, status: 'Success' },
    { id: 'group11', name: 'MCA>sso8>sso8>Ahmed Mohamed R', type: 'Generic', description: 'SSO group for Ahmed Mohamed R', tags: 0, status: 'Success' },
];

const mockGroupMemberData: { [key: string]: GroupData } = {
  'DefaultMaliciousIpGroup': {
    id: 'group1', name: 'DefaultMaliciousIpGroup', groupType: 'IPSet',
    memberCategories: [{ id: 'ips', name: 'IP Addresses', count: 14082, members: [{ 'IP Address': '1.2.3.4' }, { 'IP Address': '5.6.7.8' }], headers: ['IP Address'] }]
  },
  'Edge_NSGroup': {
    id: 'group2', name: 'Edge_NSGroup', groupType: 'Generic',
    memberCategories: [{ id: 'vms', name: 'Virtual Machines', count: 4, members: [{ Name: 'edge-01a' }], headers: ['Name'] }]
  },
  'f31e1b66-29e3-4ff2-a5bc-5233fd1a891a': {
    id: 'group3', name: 'f31e1b66-29e3-4ff2-a5bc-5233fd1a891a', groupType: 'Generic',
    memberCategories: [
      { id: 'vms', name: 'Virtual Machines', count: 8, members: [{Name: 'vm-app-01'}, {Name: 'vm-app-02'}], headers: ['Name'] },
      { id: 'ips', name: 'IP Addresses', count: 2, members: [{ 'IP Address': '192.168.1.10' }], headers: ['IP Address'] }
    ]
  },
};

@Component({
  selector: 'app-firewall-groups',
  templateUrl: './firewall-groups.component.html',
  styleUrls: ['./firewall-groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, ViewMembersModalComponent, WhereUsedModalComponent, DeleteGroupModalComponent, FilterPanelComponent],
  host: {
    '(document:mousedown)': 'onGlobalClick($event)',
  },
})
export class FirewallGroupsComponent {
  groups = signal<FirewallGroup[]>(mockFirewallGroups);
  expandedRows = signal<string[]>([]);
  isRefreshing = signal(false);
  openMenuId = signal<string | null>(null);
  searchTerm = signal('');

  // Add/Edit State
  isAddingGroup = signal(false);
  newGroupForm = signal({ name: '', description: '' });
  editingGroupId = signal<string | null>(null);
  editGroupForm = signal({ name: '', description: '' });

  // Modal State
  isViewMembersModalOpen = signal(false);
  viewingGroupData = signal<GroupData | null>(null);
  isWhereUsedModalOpen = signal(false);
  selectedGroupForModal = signal<FirewallGroup | null>(null);
  isDeleteModalOpen = signal(false);
  groupToDelete = signal<FirewallGroup | null>(null);

  // Filter Panel State
  isFilterPanelOpen = signal(false);
  
  private readonly defaultFilters: FilterState = {
    type: 'all',
    isSystemDefined: false,
    isLocked: false,
    status: 'all',
  };
  
  filters = signal<FilterState>({ ...this.defaultFilters });
  tempFilters = signal<FilterState>({ ...this.defaultFilters });

  public readonly groupTypes: FilterState['type'][] = ['all', 'Generic', 'IP Addresses Only'];
  public readonly groupStatuses: FilterState['status'][] = ['all', 'Success', 'Pending', 'Error'];

  menuRef = viewChild<ElementRef>('menuRef');

  filteredGroups = computed(() => {
    const currentFilters = this.filters();
    const term = this.searchTerm().toLowerCase();
    
    let filtered = this.groups();

    // Apply main search term
    if (term) {
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(term) || 
        g.description.toLowerCase().includes(term)
      );
    }
    
    // Apply advanced filters
    return filtered.filter(g => {
      const typeMatch = currentFilters.type === 'all' || g.type === currentFilters.type;
      const systemDefinedMatch = !currentFilters.isSystemDefined || g.isSystemDefined === true;
      const lockedMatch = !currentFilters.isLocked || g.isLocked === true;
      const statusMatch = currentFilters.status === 'all' || g.status === currentFilters.status;

      return typeMatch && systemDefinedMatch && lockedMatch && statusMatch;
    });
  });

  activeFilterCount = computed(() => {
    const { type, isSystemDefined, isLocked, status } = this.filters();
    let count = 0;
    if (type !== 'all') count++;
    if (isSystemDefined) count++;
    if (isLocked) count++;
    if (status !== 'all') count++;
    return count;
  });

  onGlobalClick(event: MouseEvent): void {
    const target = event.target as Node;
    // Close 3-dot menu
    if (this.openMenuId() && this.menuRef() && !this.menuRef()!.nativeElement.contains(target)) {
        const clickedButton = (event.target as HTMLElement).closest(`[data-menu-button-id="${this.openMenuId()}"]`);
        if (!clickedButton) {
            this.openMenuId.set(null);
        }
    }
  }
  
  toggleActionMenu(event: MouseEvent, id: string): void {
      event.stopPropagation();
      this.openMenuId.update(current => current === id ? null : id);
  }

  // --- Add Group Logic ---
  handleAddGroupClick(): void {
    this.isAddingGroup.set(true);
    this.handleCancelEdit(); // Ensure we're not editing at the same time
  }

  handleCancelNewGroup(): void {
    this.isAddingGroup.set(false);
    this.newGroupForm.set({ name: '', description: '' });
  }

  handleSaveNewGroup(): void {
    const formValue = this.newGroupForm();
    if (!formValue.name.trim()) return;
    
    const newGroup: FirewallGroup = {
      id: `group-${Date.now()}`,
      name: formValue.name.trim(),
      type: 'Generic',
      description: formValue.description.trim(),
      tags: 0,
      isSystemDefined: false,
      isLocked: false,
      status: 'Success',
    };
    this.groups.update(groups => [newGroup, ...groups]);
    this.handleCancelNewGroup();
  }

  // --- Edit Group Logic ---
  handleStartEdit(group: FirewallGroup): void {
    this.editingGroupId.set(group.id);
    this.editGroupForm.set({ name: group.name, description: group.description });
    this.handleCancelNewGroup(); // Ensure we're not adding at the same time
  }

  handleCancelEdit(): void {
    this.editingGroupId.set(null);
  }

  handleSaveEdit(): void {
    const editingId = this.editingGroupId();
    if (!editingId) return;
    
    const formValue = this.editGroupForm();
    if (!formValue.name.trim()) return;

    this.groups.update(groups =>
      groups.map(g =>
        g.id === editingId
          ? { ...g, name: formValue.name.trim(), description: formValue.description.trim() }
          : g
      )
    );
    this.editingGroupId.set(null);
  }

  // --- Table Interaction ---
  handleToggleRow(id: string): void {
    this.expandedRows.update(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  }

  handleToggleExpandAll(): void {
    const allIds = this.filteredGroups().map(g => g.id);
    this.expandedRows.update(prev => prev.length === allIds.length ? [] : allIds);
  }

  handleRefresh(): void {
    this.isRefreshing.set(true);
    setTimeout(() => this.isRefreshing.set(false), 1000);
  }

  // --- Modals ---
  handleOpenViewMembers(groupName: string): void {
    const groupData = mockGroupMemberData[groupName];
    if (groupData) {
        this.viewingGroupData.set(groupData);
    } else {
        this.viewingGroupData.set({
            id: `fallback-${Date.now()}`, name: groupName, groupType: 'Generic',
            memberCategories: [{id: 'vms', name: 'Virtual Machines', count: 0, members: [], headers: ['Name']}]
        });
    }
    this.isViewMembersModalOpen.set(true);
  }

  handleOpenWhereUsedModal(group: FirewallGroup): void {
    this.selectedGroupForModal.set(group);
    this.isWhereUsedModalOpen.set(true);
  }

  handleOpenDeleteModal(group: FirewallGroup): void {
    this.groupToDelete.set(group);
    this.isDeleteModalOpen.set(true);
  }

  handleCloseDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.groupToDelete.set(null);
  }

  handleConfirmDelete(): void {
    const group = this.groupToDelete();
    if (group) {
      this.groups.update(currentGroups => currentGroups.filter(g => g.id !== group.id));
    }
    this.handleCloseDeleteModal();
  }

  // --- Filter Panel Logic ---
  openFilterPanel(): void {
    this.tempFilters.set(this.filters());
    this.isFilterPanelOpen.set(true);
  }

  closeFilterPanel(): void {
    this.isFilterPanelOpen.set(false);
  }

  applyFilters(): void {
    this.filters.set(this.tempFilters());
    this.closeFilterPanel();
  }

  clearFilters(): void {
    this.tempFilters.set({ ...this.defaultFilters });
    this.filters.set({ ...this.defaultFilters });
    this.closeFilterPanel();
  }
  
  updateTempFilterType(type: FilterState['type']): void {
    this.tempFilters.update(f => ({...f, type}));
  }

  updateTempFilterStatus(status: FilterState['status']): void {
    this.tempFilters.update(f => ({...f, status}));
  }

  updateTempFilterSystemDefined(checked: boolean): void {
    this.tempFilters.update(f => ({...f, isSystemDefined: checked}));
  }

  updateTempFilterLocked(checked: boolean): void {
    this.tempFilters.update(f => ({...f, isLocked: checked}));
  }
}