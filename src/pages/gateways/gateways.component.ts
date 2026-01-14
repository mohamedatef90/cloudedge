

import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { GatewayService } from './gateway.service';
import { Gateway } from './gateways.types';
import { AdvancedDeleteConfirmationModalComponent } from '../../components/advanced-delete-confirmation-modal/advanced-delete-confirmation-modal.component';

type SortColumn = keyof Omit<Gateway, 'id' | 'dhcp'>;

@Component({
  selector: 'app-gateways',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, RouterModule, AdvancedDeleteConfirmationModalComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class GatewaysComponent {
  private gatewayService = inject(GatewayService);

  openActionMenuId = signal<string | null>(null);
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');
  isDeleteModalOpen = signal(false);
  gatewayToDelete = signal<Gateway | null>(null);

  gateways = this.gatewayService.gateways;

  filteredGateways = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    const filtered = this.gateways().filter(gw => 
      gw.name.toLowerCase().includes(term) ||
      gw.subnet.toLowerCase().includes(term) ||
      gw.description.toLowerCase().includes(term) ||
      (gw.reservation && gw.reservation.toLowerCase().includes(term))
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

  openDeleteModal(gateway: Gateway): void {
    this.gatewayToDelete.set(gateway);
    this.isDeleteModalOpen.set(true);
    this.closeActionMenu();
  }

  handleConfirmDelete(): void {
    const gateway = this.gatewayToDelete();
    if (gateway) {
      this.gatewayService.deleteGateway(gateway.id);
    }
    this.isDeleteModalOpen.set(false);
    this.gatewayToDelete.set(null);
  }
}