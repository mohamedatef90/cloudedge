
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { StaticRoute } from '../../routes.types';
import { RouteFirewallService } from '../../route-firewall.service';

type SortColumn = keyof Omit<StaticRoute, 'id'> | 'name' | 'firewallRuleId';

@Component({
  selector: 'app-static-route',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
  templateUrl: './static-route.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class StaticRouteComponent {
  private routeFirewallService = inject(RouteFirewallService);
  firewallRules = this.routeFirewallService.firewallRules;
  
  routes = signal<StaticRoute[]>([
      { id: 'sr-1', name: 'Default-Route', destination: '0.0.0.0/0', nextHop: '192.168.1.1', firewallRuleId: 'fw-1', enabled: true },
      { id: 'sr-2', name: 'DMZ-Route', destination: '10.10.20.0/24', nextHop: '192.168.1.254', firewallRuleId: 'fw-2', enabled: true },
      { id: 'sr-3', name: 'Legacy-System-Route', destination: '172.16.0.0/16', nextHop: '192.168.1.253', firewallRuleId: null, enabled: false },
  ]);

  selectedRouteIds = signal<string[]>([]);
  isAddingRoute = signal(false);
  newRouteForm = signal(this.getInitialNewRouteState());

  sortColumn = signal<SortColumn>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  openActionMenuId = signal<string | null>(null);

  isSelectionEmpty = computed(() => this.selectedRouteIds().length === 0);

  sortedRoutes = computed(() => {
    const routes = this.routes();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    return [...routes].sort((a, b) => {
      const aValue = column === 'firewallRuleId' ? this.getFirewallRuleName(a.firewallRuleId) : a[column as keyof StaticRoute];
      const bValue = column === 'firewallRuleId' ? this.getFirewallRuleName(b.firewallRuleId) : b[column as keyof StaticRoute];

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  });

  private getInitialNewRouteState(): Omit<StaticRoute, 'id'> {
    return { name: '', destination: '', nextHop: '', firewallRuleId: null, enabled: true };
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

  deleteRoute(id: string): void {
    this.routes.update(routes => routes.filter(r => r.id !== id));
    this.closeActionMenu();
  }

  handleAddRouteClick(): void {
    this.isAddingRoute.set(true);
  }

  handleCancelNewRoute(): void {
    this.isAddingRoute.set(false);
    this.newRouteForm.set(this.getInitialNewRouteState());
  }

  handleSaveNewRoute(): void {
    const formValue = this.newRouteForm();
    if (formValue.name.trim() && formValue.destination.trim() && formValue.nextHop.trim()) {
      const newRoute: StaticRoute = { id: `sr-${Date.now()}`, ...formValue };
      this.routes.update(routes => [newRoute, ...routes]);
      this.handleCancelNewRoute();
    }
  }

  handleDeleteClick(): void {
    if (this.isSelectionEmpty()) return;
    this.routes.update(routes => routes.filter(r => !this.selectedRouteIds().includes(r.id)));
    this.selectedRouteIds.set([]);
  }

  handleRouteToggle(route: StaticRoute, enabled: boolean): void {
    this.routes.update(routes => 
        routes.map(r => r.id === route.id ? { ...r, enabled } : r)
    );
  }
  
  handleSelect(id: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedRouteIds.update(prev => 
      isChecked ? [...prev, id] : prev.filter(i => i !== id)
    );
  }

  getFirewallRuleName(ruleId: string | null): string {
      if (!ruleId) return 'None';
      return this.firewallRules().find(r => r.id === ruleId)?.name || 'N/A';
  }
}
