import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { NatService } from './nat.service';
import { NatRule } from './nats.types';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';

type SortColumn = keyof Omit<NatRule, 'id' | 'dhcp'>;

@Component({
  selector: 'app-nats',
  templateUrl: './nats.component.html',
  styleUrls: ['./nats.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, RouterModule, AdvancedDeleteConfirmationModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class NatsComponent {
  private natService = inject(NatService);

  openActionMenuId = signal<string | null>(null);
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  isDeleteModalOpen = signal(false);
  natRuleToDelete = signal<NatRule | null>(null);

  natRules = this.natService.natRules;

  filteredNatRules = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    const filtered = this.natRules().filter(rule => 
      rule.name.toLowerCase().includes(term) ||
      rule.source.toLowerCase().includes(term) ||
      rule.destination.toLowerCase().includes(term) ||
      rule.description.toLowerCase().includes(term) ||
      (rule.reservation && rule.reservation.toLowerCase().includes(term))
    );

    return [...filtered].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;

      if (aValue === null || bValue === null) {
        comparison = aValue === bValue ? 0 : aValue === null ? -1 : 1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  });

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

  getStatusClass(status: NatRule['status']): string {
    switch (status) {
      case 'Enabled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Disabled':
        return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300';
    }
  }

  openDeleteModal(rule: NatRule): void {
    this.natRuleToDelete.set(rule);
    this.isDeleteModalOpen.set(true);
    this.closeActionMenu();
  }
  
  handleConfirmDelete(): void {
    const rule = this.natRuleToDelete();
    if (rule) {
      this.natService.deleteNatRule(rule.id);
    }
    this.isDeleteModalOpen.set(false);
    this.natRuleToDelete.set(null);
  }
}
