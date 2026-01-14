import { ChangeDetectionStrategy, Component, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { FirewallPolicy, FirewallRule, SelectableGroup } from '../../types';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch.component';

interface Tag { id: string; tag: string; scope: string; }
type SaveEventPayload = { policyId: string; ruleId: string; newAppliedTo: string };

@Component({
  selector: 'app-edit-rule-applied-to-modal',
  templateUrl: './edit-rule-applied-to-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
})
export class EditRuleAppliedToModalComponent {
  isOpen = input.required<boolean>();
  rule = input<FirewallRule | null>();
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
        const currentRule = this.rule();
        if (currentRule) {
          if (currentRule.appliedTo && currentRule.appliedTo !== 'DFW') {
              this.selected.set(currentRule.appliedTo.split(',').map(s => s.trim()));
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
    const p = this.policy();
    const r = this.rule();
    if (!p || !r) return;

    const selectedGroups = this.selected();
    const newAppliedTo = selectedGroups.length > 0 ? selectedGroups.join(', ') : 'DFW';
    
    this.save.emit({ policyId: p.id, ruleId: r.id, newAppliedTo });
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