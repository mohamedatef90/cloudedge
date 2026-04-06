import { ChangeDetectionStrategy, Component, signal, computed, ElementRef, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { ViewMembersModalComponent } from './components/view-members-modal/view-members-modal.component';
import { WhereUsedModalComponent } from './components/where-used-modal/where-used-modal.component';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';
import { FirewallGroupsService, FirewallGroup, GroupData, MemberCategory } from '../../services/firewall-groups.service';

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

type SortColumn = 'name' | 'reservation' | 'description';

@Component({
  selector: 'app-firewall-groups',
  templateUrl: './firewall-groups.component.html',
  styleUrls: ['./firewall-groups.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, ViewMembersModalComponent, WhereUsedModalComponent, AdvancedDeleteConfirmationModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class FirewallGroupsComponent {
  private router = inject(Router);
  private firewallGroupsService = inject(FirewallGroupsService);
  
  groups = this.firewallGroupsService.getGroups();
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  openActionMenuId = signal<string | null>(null);

  // Modal State
  isViewMembersModalOpen = signal(false);
  viewingGroupData = signal<GroupData | null>(null);
  isWhereUsedModalOpen = signal(false);
  selectedGroupForModal = signal<FirewallGroup | null>(null);
  isDeleteModalOpen = signal(false);
  groupToDelete = signal<FirewallGroup | null>(null);

  menuRef = viewChild<ElementRef>('menuRef');

  filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    let filtered = this.groups().filter(g => 
      g.name.toLowerCase().includes(term) || 
      g.description.toLowerCase().includes(term)
    );
    
    return [...filtered].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;

      if (aValue === undefined || bValue === undefined) {
        comparison = aValue === bValue ? 0 : aValue === undefined ? -1 : 1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  });

  onGlobalClick(target: any): void {
    if (!target.closest('.action-menu-container')) {
      this.closeActionMenu();
    }
  }
  
  setSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  toggleActionMenu(id: string): void {
    this.openActionMenuId.update(currentId => (currentId === id ? null : id));
  }

  closeActionMenu(): void {
    this.openActionMenuId.set(null);
  }

  // --- Add Group Logic ---
  handleAddGroupClick(): void {
    this.router.navigate(['/app/cloud-edge/inventory/firewall-groups/manage']);
  }

  // --- Edit Group Logic ---
  handleStartEdit(group: FirewallGroup): void {
    this.router.navigate(['/app/cloud-edge/inventory/firewall-groups/manage', group.id]);
    this.closeActionMenu();
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
    this.closeActionMenu();
  }

  handleCloseDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.groupToDelete.set(null);
  }

  handleConfirmDelete(): void {
    const group = this.groupToDelete();
    if (group) {
      this.firewallGroupsService.deleteGroup(group.id);
    }
    this.handleCloseDeleteModal();
  }
}
