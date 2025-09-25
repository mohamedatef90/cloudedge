import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { PaginationComponent } from '../ids-ips-malware-prevention/components/pagination/pagination.component';
import { AddServiceModalComponent } from './components/add-service-modal/add-service-modal.component';
import { WhereUsedModalComponent } from './components/where-used-modal/where-used-modal.component';

export interface Service {
  id: string;
  name: string;
  icon: string;
  protocol: 'TCP' | 'UDP' | 'Any';
  destinationPort: string;
  description: string;
  tags: number;
  whereUsedCount: number;
  status: 'Success';
}

const mockInitialServices: Service[] = [
  { id: '1', name: '66', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '66', description: 'Not Set', tags: 0, whereUsedCount: 1, status: 'Success' },
  { id: '2', name: '10', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '10', description: 'Service for port 10', tags: 2, whereUsedCount: 5, status: 'Success' },
  { id: '3', name: '5', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '5', description: 'Service for port 5', tags: 0, whereUsedCount: 3, status: 'Success' },
  { id: '4', name: '2341', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '2341', description: 'Service for port 2341', tags: 1, whereUsedCount: 0, status: 'Success' },
  { id: '5', name: '1212', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '1212', description: 'Service for port 1212', tags: 0, whereUsedCount: 1, status: 'Success' },
  { id: '6', name: '89', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '89', description: 'Service for port 89', tags: 0, whereUsedCount: 2, status: 'Success' },
  { id: '7', name: '2', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '2', description: 'Service for port 2', tags: 0, whereUsedCount: 8, status: 'Success' },
  { id: '8', name: '120', icon: 'fas fa-cog', protocol: 'TCP', destinationPort: '120', description: 'Service for port 120', tags: 3, whereUsedCount: 0, status: 'Success' },
  { id: '9', name: 'Active Directory Server', icon: 'fas fa-lock', protocol: 'TCP', destinationPort: '464', description: 'Kerberos password change', tags: 5, whereUsedCount: 12, status: 'Success' },
  { id: '10', name: 'Active Directory Server UDP', icon: 'fas fa-lock', protocol: 'UDP', destinationPort: '464', description: 'Kerberos password change (UDP)', tags: 5, whereUsedCount: 12, status: 'Success' },
  { id: '11', name: 'AD Server', icon: 'fas fa-lock', protocol: 'TCP', destinationPort: '1024', description: 'Active Directory Service', tags: 5, whereUsedCount: 10, status: 'Success' },
];

@Component({
  selector: 'app-firewall-services',
  templateUrl: './firewall-services.component.html',
  styleUrls: ['./firewall-services.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    PaginationComponent,
    AddServiceModalComponent,
    WhereUsedModalComponent,
  ],
})
export class FirewallServicesComponent {
  services = signal<Service[]>(mockInitialServices);
  expandedIds = signal<string[]>(['1']);
  filterTerm = signal('');
  currentPage = signal(1);
  rowsPerPage = signal(10);
  selectedServices = signal<string[]>([]);
  isAddModalOpen = signal(false);
  isRefreshing = signal(false);
  isWhereUsedModalOpen = signal(false);
  selectedServiceForModal = signal<Service | null>(null);
  
  filteredServices = computed(() => {
    const term = this.filterTerm().toLowerCase();
    if (!term) return this.services();
    return this.services().filter(s => s.name.toLowerCase().includes(term));
  });

  paginatedServices = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.rowsPerPage();
    return this.filteredServices().slice(startIndex, startIndex + this.rowsPerPage());
  });

  isAllOnPageSelected = computed(() => {
    const paginated = this.paginatedServices();
    if (paginated.length === 0) return false;
    return paginated.every(s => this.selectedServices().includes(s.id));
  });

  handleOpenWhereUsedModal(service: Service): void {
    this.selectedServiceForModal.set(service);
    this.isWhereUsedModalOpen.set(true);
  }

  handleToggleExpand(id: string): void {
    this.expandedIds.update(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  }

  handleToggleExpandAll(): void {
    if (this.expandedIds().length === this.filteredServices().length) {
      this.expandedIds.set([]);
    } else {
      this.expandedIds.set(this.filteredServices().map(g => g.id));
    }
  }

  handleSelect(id: string, isChecked: boolean): void {
    this.selectedServices.update(prev => isChecked ? [...prev, id] : prev.filter(serviceId => serviceId !== id));
  }

  handleSelectAllOnPage(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedServices.update(prev => {
      const pageIds = this.paginatedServices().map(s => s.id);
      if (isChecked) {
        return [...new Set([...prev, ...pageIds])];
      } else {
        return prev.filter(id => !pageIds.includes(id));
      }
    });
  }

  handleAddService(service: Omit<Service, 'id' | 'icon' | 'description' | 'tags' | 'whereUsedCount' | 'status'>): void {
    const newService: Service = {
      id: `service-${Date.now()}`,
      icon: 'fas fa-cog', // Default icon for new services
      description: 'Newly added service',
      tags: 0,
      whereUsedCount: 0,
      status: 'Success',
      ...service,
    };
    this.services.update(prev => [newService, ...prev]);
    this.isAddModalOpen.set(false);
  }
    
  handleRefresh(): void {
    this.isRefreshing.set(true);
    setTimeout(() => {
        this.isRefreshing.set(false);
    }, 1000);
  }
}
