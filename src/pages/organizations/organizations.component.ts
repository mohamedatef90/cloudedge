

import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../components/icon/icon.component';
import { CreateOrganizationModalComponent } from './components/create-organization-modal/create-organization-modal.component';

interface Organization {
  id: string;
  name: string;
  creationDate: string;
  description: string;
}

type SortColumn = keyof Omit<Organization, 'id'>;

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, IconComponent, CreateOrganizationModalComponent, FormsModule],
  // FIX: Replaced @HostListener with the host property for better component encapsulation.
  host: {
    '(document:click)': 'onGlobalClick($event.target)',
  },
})
export class OrganizationsComponent {
  openActionMenuId = signal<string | null>(null);
  isModalOpen = signal(false);
  organizationToEdit = signal<Organization | null>(null);
  searchTerm = signal('');
  sortColumn = signal<SortColumn>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  organizations = signal<Organization[]>([
    { id: 'org-1', name: 'WorldPosta', creationDate: '2023-01-15', description: 'Primary corporate organization for all services.' },
    { id: 'org-2', name: 'CloudEdge Solutions', creationDate: '2023-03-22', description: 'Customer account for CloudEdge infrastructure.' },
    { id: 'org-3', name: 'Email Archiving Dept', creationDate: '2023-05-10', description: 'Department managing email archiving solutions.' },
    { id: 'org-4', name: 'DevOps Team', creationDate: '2023-08-01', description: 'Internal team for development and operations.' },
    { id: 'org-5', name: 'Marketing & Sales', creationDate: '2022-11-30', description: 'Handles all marketing campaigns and sales.' },
  ]);

  filteredOrganizations = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    
    const filtered = this.organizations().filter(org => 
      org.name.toLowerCase().includes(term) ||
      org.description.toLowerCase().includes(term)
    );

    return [...filtered].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      let comparison = 0;

      if (column === 'creationDate') {
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      } else {
        comparison = aValue.localeCompare(bValue);
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

  openCreateModal(): void {
    this.organizationToEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(org: Organization): void {
    this.organizationToEdit.set(org);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.organizationToEdit.set(null);
  }

  createOrganization(event: { name: string, description: string }): void {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: event.name,
      creationDate: new Date().toISOString().split('T')[0],
      description: event.description,
    };
    this.organizations.update(orgs => [newOrg, ...orgs]);
    this.closeModal();
  }
  
  updateOrganization(updatedOrg: Organization): void {
    this.organizations.update(orgs =>
      orgs.map(org => (org.id === updatedOrg.id ? updatedOrg : org))
    );
    this.closeModal();
  }
}
