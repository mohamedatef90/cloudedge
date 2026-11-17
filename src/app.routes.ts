import { Routes } from '@angular/router';
import { CloudEdgeLayoutComponent } from './layouts/cloud-edge/cloud-edge-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
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
import { ProfilesComponent } from './pages/profiles/profiles.component';
import { AddContextProfileComponent } from './pages/profiles/pages/add-context-profile/add-context-profile.component';
import { VirtualMachinesComponent } from './pages/virtual-machines/virtual-machines.component';
import { CreateVmComponent } from './pages/virtual-machines/pages/create-vm/create-vm.component';
import { StorageComponent } from './pages/storage/storage.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { GatewaysComponent } from './pages/gateways/gateways.component';
import { NatsComponent } from './pages/nats/nats.component';
import { RoutesComponent } from './pages/routes/routes.component';
import { ScheduledTasksComponent } from './pages/scheduled-tasks/scheduled-tasks.component';
import { ScheduledGroupsComponent } from './pages/scheduled-groups/scheduled-groups.component';
import { RunningTasksComponent } from './pages/running-tasks/running-tasks.component';
import { FirewallGroupsComponent } from './pages/firewall-groups/firewall-groups.component';
import { ManageGroupComponent } from './pages/firewall-groups/pages/manage-group/manage-group.component';
import { FirewallServicesComponent } from './pages/firewall-services/firewall-services.component';
import { OrganizationProfileComponent } from './pages/organization-profile/organization-profile.component';
import { OsImagesComponent } from './pages/virtual-machines/pages/os-images/os-images.component';
import { VmProfileComponent } from './pages/virtual-machines/pages/vm-profile/vm-profile.component';
import { MarketplacePageComponent } from './pages/marketplace/marketplace-page/marketplace-page.component';
import { ConfigureAppPageComponent } from './pages/marketplace/configure-app-page/configure-app-page.component';
import { AddReservationComponent } from './pages/reservations/pages/add-reservation/add-reservation.component';
import { CreateEditGatewayComponent } from './pages/gateways/pages/create-edit-gateway/create-edit-gateway.component';
import { CreateEditNatComponent } from './pages/nats/pages/create-edit-nat/create-edit-nat.component';
import { ReservedIpComponent } from './pages/reserved-ip/reserved-ip.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { CommunityForumComponent } from './pages/community-forum/community-forum.component';
import { TopicPageComponent } from './pages/community-forum/pages/topic-page/topic-page.component';
import { ReservationDetailsComponent } from './pages/reservations/pages/reservation-details/reservation-details.component';
import { RecycleBinComponent } from './pages/recycle-bin/recycle-bin.component';
import { DistributedFirewallOldComponent } from './pages/distributed-firewall-old/distributed-firewall-old.component';
import { AddDfwOldPolicyComponent } from './pages/distributed-firewall-old/pages/add-dfw-old-policy/add-dfw-old-policy.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'app/cloud-edge', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Sign In' },
  {
    path: 'app/cloud-edge',
    component: CloudEdgeLayoutComponent,
    canActivate: [authGuard],
    // Re-check on every child navigation, not only when entering the layout.
    canActivateChild: [authGuard],
    children: [
      { path: '', component: DashboardComponent, title: 'CloudEdge Dashboard' },
      // Administration — micro role has no access
      { path: 'administration/organizations', component: OrganizationsComponent, title: 'Organizations', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'administration/profiles', component: ProfilesComponent, title: 'Profiles', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'administration/profiles/add-context-profile', component: AddContextProfileComponent, title: 'Add Context Profile', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'administration/organizations/:id', component: OrganizationProfileComponent, title: 'Organization Profile', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'administration/action-logs', component: ActionLogsComponent, title: 'Action Logs', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'administration/tickets', component: TicketsComponent, title: 'Tickets', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      // Resources — micro role has no access
      { path: 'resources/virtual-machines', component: VirtualMachinesComponent, title: 'Virtual Machines', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/virtual-machines/create', component: CreateVmComponent, title: 'Create Virtual Machine', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/virtual-machines/images', component: OsImagesComponent, title: 'Select OS Image', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/virtual-machines/:id', component: VmProfileComponent, title: 'Virtual Machine Profile', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/recycle-bin', component: RecycleBinComponent, title: 'Recycle Bin', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/marketplace', redirectTo: 'resources/marketplace/category/cms-publishing', pathMatch: 'full' },
      { path: 'resources/marketplace/category/:id', component: MarketplacePageComponent, title: 'Marketplace', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/marketplace/configure/:id', component: ConfigureAppPageComponent, title: 'Configure Marketplace App', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/storage', component: StorageComponent, title: 'Storage', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/reservations', component: ReservationsComponent, title: 'Reservations', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/reservations/add', component: AddReservationComponent, title: 'Add Reservation', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/reservations/:id', component: ReservationDetailsComponent, title: 'Reservation Details', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'resources/getting-started', component: GettingStartedComponent, title: 'Getting Started Guide' },
      { path: 'resources/community-forum', component: CommunityForumComponent, title: 'Community Forum' },
      { path: 'resources/community-forum/topic/:id', component: TopicPageComponent, title: 'Community Forum Topic' },
      // Network — micro role has no access
      { path: 'network/gateways', component: GatewaysComponent, title: 'Gateways', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'network/gateways/create', component: CreateEditGatewayComponent, title: 'Create Gateway', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'network/gateways/edit/:id', component: CreateEditGatewayComponent, title: 'Edit Gateway', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'network/nats', component: NatsComponent, title: 'NATs', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'network/nats/create', component: CreateEditNatComponent, title: 'Create NAT Rule', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'network/nats/edit/:id', component: CreateEditNatComponent, title: 'Edit NAT Rule', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'network/reserved-ip', component: ReservedIpComponent, title: 'Reserved IP', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'network/routes', component: RoutesComponent, title: 'Routes', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      // Inventory
      { path: 'inventory/applications', component: FirewallPoliciesComponent, title: 'Applications' },
      { path: 'inventory/firewall-groups', component: FirewallGroupsComponent, title: 'Groups' },
      { path: 'inventory/firewall-groups/manage', component: ManageGroupComponent, title: 'Add Group' },
      { path: 'inventory/firewall-groups/manage/:id', component: ManageGroupComponent, title: 'Edit Group' },
      { path: 'inventory/firewall-services', component: FirewallServicesComponent, title: 'Services' },
      // Security
      { path: 'security/hub', component: SecurityOverviewComponent, title: 'Security Hub' },
      { path: 'security/suspicious-traffic', component: SuspiciousTrafficComponent, title: 'Suspicious Traffic' },
      { path: 'security/filtering-analysis', component: FilteringAnalysisComponent, title: 'Filtering and Analysis' },
      { path: 'security/distributed-firewall', component: DistributedFirewallComponent, title: 'Distributed Firewall' },
      { path: 'security/distributed-firewall-old', component: DistributedFirewallOldComponent, title: 'Distributed Firewall-old' },
      { path: 'security/distributed-firewall-old/add-policy', component: AddDfwOldPolicyComponent, title: 'Add Distributed Firewall Policy' },
      { path: 'security/distributed-firewall-old/edit-policy/:id', component: AddDfwOldPolicyComponent, title: 'Edit Distributed Firewall Policy' },
      { path: 'security/gateway-firewall', component: GatewayFirewallComponent, title: 'Gateway Firewall' },
      { path: 'security/gateway-firewall/add-policy', loadComponent: () => import('./pages/gateway-firewall/pages/add-gateway-policy/add-gateway-policy.component').then(m => m.AddGatewayPolicyComponent), title: 'Add Gateway Firewall Policy' },
      { path: 'security/gateway-firewall/edit-policy/:id', loadComponent: () => import('./pages/gateway-firewall/pages/add-gateway-policy/add-gateway-policy.component').then(m => m.AddGatewayPolicyComponent), title: 'Edit Gateway Firewall Policy' },
      { path: 'security/hub-malware-prevention', component: IdsIpsMalwarePreventionComponent, title: 'IDS/IPS & Malware Prevention' },
      // Operations — micro role has no access
      { path: 'operations/scheduled-tasks', component: ScheduledTasksComponent, title: 'Scheduled Tasks', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'operations/scheduled-groups', component: ScheduledGroupsComponent, title: 'Scheduled Groups', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'operations/running-tasks', component: RunningTasksComponent, title: 'Running Tasks', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'operations/backup/jobs', loadComponent: () => import('./pages/backup/jobs/jobs.component').then(m => m.JobsComponent), title: 'Backup Jobs', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
      { path: 'operations/backup/restore-requests', loadComponent: () => import('./pages/backup/restore-requests/restore-requests.component').then(m => m.RestoreRequestsComponent), title: 'Restore Requests', canActivate: [roleGuard(['admin', 'reseller', 'customer'])] },
    ],
  },
  { path: '**', redirectTo: 'app/cloud-edge' } // Wildcard route
];