
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';
import { ReservationService } from './reservation.service';
import { Reservation, AddonName } from './reservation.types';

type SortColumn = 'name' | 'planName' | 'status' | 'startDate' | 'endDate';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, RouterModule],
})
export class ReservationsComponent {
  private reservationService = inject(ReservationService);

  searchTerm = signal('');
  sortColumn = signal<SortColumn>('startDate');
  sortDirection = signal<'asc' | 'desc'>('desc');
  expandedReservationId = signal<string | null>(null);

  reservations = this.reservationService.reservations;

  filteredReservations = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();

    const filtered = this.reservations().filter(res => 
      res.name.toLowerCase().includes(term) ||
      res.plan.name.toLowerCase().includes(term)
    );

    return [...filtered].sort((a, b) => {
      const aValue = column === 'planName' ? a.plan.name : a[column as keyof Omit<Reservation, 'id' | 'plan'>];
      const bValue = column === 'planName' ? b.plan.name : b[column as keyof Omit<Reservation, 'id' | 'plan'>];
      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (column === 'startDate' || column === 'endDate') {
          comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
        } else {
          comparison = aValue.localeCompare(bValue);
        }
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  });

  setSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  toggleExpand(reservationId: string): void {
    this.expandedReservationId.update(currentId => currentId === reservationId ? null : reservationId);
  }
  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusClass(status: Reservation['status']): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  }

  getAddonIcon(addonName: AddonName): string {
    const iconMap: Record<AddonName, string> = {
      'Windows Enterprise Licenses': 'fab fa-windows',
      'Linux Enterprise Licenses': 'fab fa-linux',
      'Cortex XDR Endpoint Protection / VM': 'fas fa-shield-virus',
      'Public IPs': 'fas fa-globe',
      'Load Balancer/ IP': 'fas fa-network-wired',
      'Advanced Backup by Veeam': 'fas fa-save',
      'Trend Micro Deep Security/ VM': 'fas fa-shield-halved'
    };
    return iconMap[addonName];
  }
}
