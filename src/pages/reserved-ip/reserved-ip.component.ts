import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';

interface ReservedIp {
  id: string;
  ipAddress: string;
  description: string;
  attachedTo: string | null;
  creationDate: string;
}

type SortColumn = 'ipAddress' | 'description' | 'attachedTo' | 'creationDate';

@Component({
  selector: 'app-reserved-ip',
  templateUrl: './reserved-ip.component.html',
  styleUrls: ['./reserved-ip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IconComponent],
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class ReservedIpComponent {
  openActionMenuId = signal<string | null>(null);
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('creationDate');
  sortDirection = signal<'asc' | 'desc'>('desc');

  reservedIps = signal<ReservedIp[]>([
    { id: 'ip-1', ipAddress: '85.195.99.176', description: 'Main web server public IP', attachedTo: 'prod-web-server-01', creationDate: '2023-01-20' },
    { id: 'ip-2', ipAddress: '203.0.113.10', description: 'Public access for NAT gateway', attachedTo: 'Primary-Edge-Gateway', creationDate: '2023-03-15' },
    { id: 'ip-3', ipAddress: '203.0.113.11', description: 'Staging environment public IP', attachedTo: null, creationDate: '2023-05-01' },
    { id: 'ip-4', ipAddress: '198.51.100.5', description: 'VPN endpoint', attachedTo: 'DMZ-Gateway', creationDate: '2022-12-10' },
  ]);

  filteredReservedIps = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    const filtered = this.reservedIps().filter(ip => 
      ip.ipAddress.toLowerCase().includes(term) ||
      ip.description.toLowerCase().includes(term) ||
      (ip.attachedTo && ip.attachedTo.toLowerCase().includes(term))
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
}
