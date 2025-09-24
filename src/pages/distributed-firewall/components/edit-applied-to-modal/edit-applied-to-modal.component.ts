

import { ChangeDetectionStrategy, Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { FirewallPolicy, SelectableGroup } from '../../types';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch.component';

interface Tag { id: string; tag: string; scope: string; }
type SaveEventPayload = { policyId: string; newAppliedTo: string };

@Component({
  selector: 'app-edit-applied-to-modal',
  templateUrl: './edit-applied-to-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
})
export class EditAppliedToModalComponent {
  isOpen = input.required<boolean>();
  policy = input<FirewallPolicy | null>();
  availableGroups = input.required<SelectableGroup[]>();

  close = output<void>();
  save = output<SaveEventPayload>();
  addGroup = output<SelectableGroup>();
  viewMembers = output<string>();
  viewRelatedGroups = output<SelectableGroup>();

  selected = signal<string[]>([]);
  searchTerm = signal('');
  showSelectedOnly = signal(false);
  expandedGroupId = signal<string | null>(null);
  isAddingGroup = signal(false);

  newGroupData = signal({
    groupName: '',
    description: '',
    tags: [{ id: this.uuid(), tag: '', scope: '' }] as Tag[],
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const currentPolicy = this.policy();
        if (currentPolicy) {
          if (currentPolicy.appliedTo !== 'DFW' && !currentPolicy.appliedTo.includes('Groups')) {
              this.selected.set([currentPolicy.appliedTo]);
          } else {
              this.selected.set([]);
          }
        }
        // Reset state on open
        this.searchTerm.set('');
        this.expandedGroupId.set(null);
        this.isAddingGroup.set(false);
        this.newGroupData.set({ groupName: '', description: '', tags: [{ id: this.uuid(), tag: '', scope: '' }] });
      }
    });
  }

  filteredGroups = computed(() => {
    let groups = this.availableGroups();
    if (this.showSelectedOnly()) {
      groups = groups.filter(g => this.selected().includes(g.name));
    }
    const term = this.searchTerm().toLowerCase();
    if (term) {
      groups = groups.filter(g => g.name.toLowerCase().includes(term));
    }
    return groups;
  });

  handleSelect(groupName: string): void {
    this.selected.update(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(groupName)) {
        newSelected.delete(groupName);
      } else {
        newSelected.add(groupName);
      }
      return Array.from(newSelected);
    });
  }

  handleSave(): void {
    const policy = this.policy();
    if (!policy) return;

    const selectedGroups = this.selected();
    let newAppliedTo = 'DFW';
    if (selectedGroups.length === 1) {
      newAppliedTo = selectedGroups[0];
    } else if (selectedGroups.length > 1) {
      newAppliedTo = `${selectedGroups.length} Groups`;
    }
    
    this.save.emit({ policyId: policy.id, newAppliedTo });
    this.close.emit();
  }

  toggleGroupExpansion(groupId: string): void {
    this.expandedGroupId.update(prev => (prev === groupId ? null : groupId));
  }
  
  // New Group Form Logic
  uuid(): string {
    return `id-${Date.now()}-${Math.random()}`;
  }

  handleAddTag(): void {
    this.newGroupData.update(prev => {
        if (prev.tags.length < 30) {
            return { ...prev, tags: [...prev.tags, { id: this.uuid(), tag: '', scope: '' }] };
        }
        return prev;
    });
  }

  handleRemoveTag(id: string): void {
    this.newGroupData.update(prev => ({ ...prev, tags: prev.tags.filter(t => t.id !== id) }));
  }

  handleTagChange(id: string, field: 'tag' | 'scope', value: string): void {
    this.newGroupData.update(prev => ({
      ...prev,
      tags: prev.tags.map(t => (t.id === id ? { ...t, [field]: value } : t)),
    }));
  }

  handleCancelAddGroup(): void {
    this.isAddingGroup.set(false);
    this.newGroupData.set({ groupName: '', description: '', tags: [{ id: this.uuid(), tag: '', scope: '' }] });
  }

  handleSaveNewGroup(): void {
    const data = this.newGroupData();
    if (!data.groupName.trim()) return;

    const newGroup: SelectableGroup = {
      id: this.uuid(),
      name: data.groupName,
      type: 'Generic',
      icon: 'fas fa-cubes',
      description: data.description,
      tags: data.tags.filter(t => t.tag.trim()).map(t => t.scope.trim() ? `${t.tag}|${t.scope}` : t.tag),
      memberCount: 0,
    };
    this.addGroup.emit(newGroup);
    this.handleSelect(newGroup.name);
    this.handleCancelAddGroup();
  }
}
