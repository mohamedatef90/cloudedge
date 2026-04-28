import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../distributed-firewall/components/toggle-switch/toggle-switch.component';

export interface GroupAction {
  id: string;
  name: string;
}

export interface ScheduledGroupItem {
  id: string;
  prefix: string;
  name: string;
  isExpanded: boolean;
  status: 'Enabled' | 'Disabled';
  actions: GroupAction[];
}

@Component({
  selector: 'app-scheduled-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
  templateUrl: './scheduled-groups.component.html',
})
export class ScheduledGroupsComponent {
  groups = signal<ScheduledGroupItem[]>([
    {
      id: 'g1',
      prefix: 'evr',
      name: 'Nat',
      isExpanded: true,
      status: 'Enabled',
      actions: [
        { id: 'a1', name: 'Disable' },
        { id: 'a2', name: 'Enable' }
      ]
    },
    {
      id: 'g2',
      prefix: 'b',
      name: 'PolicyRole',
      isExpanded: false,
      status: 'Enabled',
      actions: [
        { id: 'b1', name: 'Drop' },
        { id: 'b2', name: 'Reject' }
      ]
    },
    {
      id: 'g3',
      prefix: 'eg',
      name: 'PolicyRole',
      isExpanded: false,
      status: 'Disabled',
      actions: [
        { id: 'c1', name: 'Allow' },
        { id: 'c2', name: 'Allow' },
        { id: 'c3', name: 'Reject' }
      ]
    }
  ]);

  searchTerm = signal('');
  openMenuId = signal<string | null>(null);

  filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase();
    
    if (!term) return this.groups();

    return this.groups().map(group => {
      if (group.name.toLowerCase().includes(term) || group.prefix.toLowerCase().includes(term)) {
        return group;
      }
      const filteredActions = group.actions.filter(a => 
        a.name.toLowerCase().includes(term)
      );
      if (filteredActions.length > 0) {
        return { ...group, actions: filteredActions, isExpanded: true };
      }
      return null;
    }).filter(g => g !== null) as ScheduledGroupItem[];
  });

  toggleGroup(id: string) {
    this.groups.update(groups => 
      groups.map(g => g.id === id ? { ...g, isExpanded: !g.isExpanded } : g)
    );
  }

  toggleGroupStatus(id: string, event: boolean) {
    this.groups.update(groups => 
      groups.map(g => g.id === id ? { ...g, status: event ? 'Enabled' : 'Disabled' } : g)
    );
  }

  toggleMenu(id: string) {
    this.openMenuId.update(current => current === id ? null : id);
  }

  closeMenu() {
    this.openMenuId.set(null);
  }

  deleteAction(groupId: string, actionId: string) {
    this.groups.update(groups => 
      groups.map(g => {
        if (g.id === groupId) {
          return { ...g, actions: g.actions.filter(a => a.id !== actionId) };
        }
        return g;
      })
    );
  }
}
