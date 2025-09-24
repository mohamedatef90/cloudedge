import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../components/icon/icon.component';

// Mock data interfaces
interface User {
  email: string;
  displayName: string;
  creationDate: string;
}

interface Reservation {
  name: string;
  planName: string;
  startedDate: string;
  endsDate: string;
}

interface OrganizationProfile {
  name: string;
  companyName: string;
  usersCount: number;
  description: string;
  parentOrganization: string;
  reservationsCount: number;
  creationDate: string;
  virtualMachinesCount: number;
  gatewaysCount: number;
  users: User[];
  reservations: Reservation[];
}

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, IconComponent],
})
export class OrganizationProfileComponent {
  activeTab = signal<'users' | 'reservations'>('users');

  // In a real app, this would be fetched based on the route parameter
  organizationProfile = signal<OrganizationProfile>({
    name: 'WorldPosta',
    companyName: 'WorldPosta Inc.',
    usersCount: 25,
    description: 'Primary corporate organization for all services.',
    parentOrganization: 'None',
    reservationsCount: 5,
    creationDate: '2023-01-15',
    virtualMachinesCount: 12,
    gatewaysCount: 3,
    users: [
      { email: 'admin@worldposta.com', displayName: 'Admin User', creationDate: '2023-01-15' },
      { email: 'j.doe@worldposta.com', displayName: 'Jane Doe', creationDate: '2023-02-10' },
      { email: 's.smith@worldposta.com', displayName: 'Sam Smith', creationDate: '2023-03-05' },
    ],
    reservations: [
      { name: 'Prod-WebServer-Reservation', planName: 'Compute-Optimized', startedDate: '2023-01-20', endsDate: '2024-01-20' },
      { name: 'DB-Cluster-Reservation', planName: 'Memory-Optimized', startedDate: '2023-03-01', endsDate: '2024-03-01' },
      { name: 'Dev-VM-Reservation', planName: 'General Purpose', startedDate: '2023-05-15', endsDate: '2023-11-15' },
    ]
  });

  setActiveTab(tab: 'users' | 'reservations'): void {
    this.activeTab.set(tab);
  }
}