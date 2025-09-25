
import { Routes } from '@angular/router';
import { CloudEdgeLayoutComponent } from './layouts/cloud-edge/cloud-edge-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrganizationsComponent } from './pages/organizations/organizations.component';
import { FirewallPoliciesComponent } from './pages/firewall-policies/firewall-policies.component';
import { SecurityOverviewComponent } from './pages/security-overview/security-overview.component';
import { SuspiciousTrafficComponent } from './pages/suspicious-traffic/suspicious-traffic.component';
import { FilteringAnalysisComponent } from './pages/filtering-analysis/filtering-analysis.component';
import { DistributedFirewallComponent } from './pages/distributed-firewall/distributed-firewall.component';
import { GatewayFirewallComponent } from './pages/gateway-firewall/gateway-firewall.component';
import { IdsIpsMalwarePreventionComponent } from './pages/ids-ips-malware-prevention/ids-ips-malware-prevention.component';
import { ActionLogsComponent } from './pages/action-logs/action-logs.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { VirtualMachinesComponent } from './pages/virtual-machines/virtual-machines.component';
import { CreateVmComponent } from './pages/virtual-machines/pages/create-vm/create-vm.component';
import { StorageComponent } from './pages/storage/storage.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { GatewaysComponent } from './pages/gateways/gateways.component';
import { NatsComponent } from './pages/nats/nats.component';
import { RoutesComponent } from './pages/routes/routes.component';
import { ScheduledTasksComponent } from './pages/scheduled-tasks/scheduled-tasks.component';
import { RunningTasksComponent } from './pages/running-tasks/running-tasks.component';
import { FirewallGroupsComponent } from './pages/firewall-groups/firewall-groups.component';
import { FirewallServicesComponent } from './pages/firewall-services/firewall-services.component';
import { OrganizationProfileComponent } from './pages/organization-profile/organization-profile.component';
import { OsImagesComponent } from './pages/virtual-machines/pages/os-images/os-images.component';
import { VmProfileComponent } from './pages/virtual-machines/pages/vm-profile/vm-profile.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'app/cloud-edge', pathMatch: 'full' },
  {
    path: 'app/cloud-edge',
    component: CloudEdgeLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, title: 'CloudEdge Dashboard' },
      // Administration
      { path: 'administration/organizations', component: OrganizationsComponent, title: 'Organizations' },
      { path: 'administration/organizations/:id', component: OrganizationProfileComponent, title: 'Organization Profile' },
      { path: 'administration/action-logs', component: ActionLogsComponent, title: 'Action Logs' },
      { path: 'administration/tickets', component: TicketsComponent, title: 'Tickets' },
      // Resources
      { path: 'resources/virtual-machines', component: VirtualMachinesComponent, title: 'Virtual Machines' },
      { path: 'resources/virtual-machines/create', component: CreateVmComponent, title: 'Create Virtual Machine' },
      { path: 'resources/virtual-machines/images', component: OsImagesComponent, title: 'Select OS Image' },
      { path: 'resources/virtual-machines/:id', component: VmProfileComponent, title: 'Virtual Machine Profile' },
      { path: 'resources/storage', component: StorageComponent, title: 'Storage' },
      { path: 'resources/reservations', component: ReservationsComponent, title: 'Reservations' },
      // Network
      { path: 'network/gateways', component: GatewaysComponent, title: 'Gateways' },
      { path: 'network/nats', component: NatsComponent, title: 'NATs' },
      { path: 'network/routes', component: RoutesComponent, title: 'Routes' },
      // Inventory
      { path: 'inventory/applications', component: FirewallPoliciesComponent, title: 'Applications' },
      { path: 'inventory/firewall-groups', component: FirewallGroupsComponent, title: 'Groups' },
      { path: 'inventory/firewall-services', component: FirewallServicesComponent, title: 'Services' },
      // Security
      { path: 'security/ids-ips', component: SecurityOverviewComponent, title: 'Security IDS/IPS' },
      { path: 'security/suspicious-traffic', component: SuspiciousTrafficComponent, title: 'Suspicious Traffic' },
      { path: 'security/filtering-analysis', component: FilteringAnalysisComponent, title: 'Filtering and Analysis' },
      { path: 'security/distributed-firewall', component: DistributedFirewallComponent, title: 'Distributed Firewall' },
      { path: 'security/gateway-firewall', component: GatewayFirewallComponent, title: 'Gateway Firewall' },
      { path: 'security/ids-ips-malware-prevention', component: IdsIpsMalwarePreventionComponent, title: 'IDS/IPS & Malware Prevention' },
      // Operations
      { path: 'operations/scheduled-tasks', component: ScheduledTasksComponent, title: 'Scheduled Tasks' },
      { path: 'operations/running-tasks', component: RunningTasksComponent, title: 'Running Tasks' },
    ],
  },
  { path: '**', redirectTo: 'app/cloud-edge' } // Wildcard route
];
