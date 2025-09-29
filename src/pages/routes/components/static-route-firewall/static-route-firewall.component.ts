
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { StaticRouteFirewallRule } from '../../routes.types';
import { RouteFirewallService } from '../../route-firewall.service';

type SortColumn = keyof Omit<StaticRouteFirewallRule, 'id'> | 'name';

@Component({
  selector: 'app-static-route-firewall',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
  templateUrl: './static-route-firewall.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class StaticRouteFirewallComponent {
  private routeFirewallService = inject(RouteFirewallService);
  firewallRules = this.routeFirewallService.firewallRules;

  selectedRuleIds = signal<string[]>([]);
  isAddingRule = signal(false);
  newRuleForm = signal(this.getInitialNewRuleState());

  sortColumn = signal<SortColumn>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  openActionMenuId = signal<string | null>(null);

  isSelectionEmpty = computed(() => this.selectedRuleIds().length === 0);

  sortedFirewallRules = computed(() => {
    const rules = this.firewallRules();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    return [...rules].sort((a, b) => {
      const aValue = a[column as keyof StaticRouteFirewallRule];
      const bValue = b[column as keyof StaticRouteFirewallRule];
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  });

  private getInitialNewRuleState(): Omit<StaticRouteFirewallRule, 'id'> {
    return { name: '', sources: 'Any', destinations: 'Any', services: 'Any', action: 'Allow', enabled: true };
  }
  
  onGlobalClick(target: HTMLElement): void {
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

  deleteRule(id: string): void {
      this.routeFirewallService.deleteRules([id]);
      this.closeActionMenu();
  }

  handleAddRuleClick(): void {
    this.isAddingRule.set(true);
  }

  handleCancelNewRule(): void {
    this.isAddingRule.set(false);
    this.newRuleForm.set(this.getInitialNewRuleState());
  }

  handleSaveNewRule(): void {
    const formValue = this.newRuleForm();
    if (formValue.name.trim()) {
      this.routeFirewallService.addRule(formValue);
      this.handleCancelNewRule();
    }
  }

  handleDeleteClick(): void {
    if (this.isSelectionEmpty()) return;
    this.routeFirewallService.deleteRules(this.selectedRuleIds());
    this.selectedRuleIds.set([]);
  }

  handleRuleToggle(rule: StaticRouteFirewallRule, enabled: boolean): void {
    this.routeFirewallService.updateRule({ ...rule, enabled });
  }

  handleSelect(id: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedRuleIds.update(prev => 
      isChecked ? [...prev, id] : prev.filter(i => i !== id)
    );
  }
}
