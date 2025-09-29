import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../../../../components/icon/icon.component';
import { AuthService } from '../../../../services/auth.service';

interface SidebarItem {
  name: string;
  icon: string;
  path: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

@Component({
  selector: 'app-cloud-edge-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink, RouterLinkActive],
})
export class CloudEdgeSidebarComponent {
  isCollapsed = input.required<boolean>();
  
  private authService = inject(AuthService);
  // FIX: Explicitly type router to fix a type inference issue where it was being inferred as 'unknown'.
  private router: Router = inject(Router);
  user = this.authService.user;
  activeSectionTitle = signal<string>('');

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveSection(event.urlAfterRedirects);
    });
    this.updateActiveSection(this.router.url);
  }

  private updateActiveSection(url: string): void {
    const sections = this.sidebarSections();
    let bestMatch = { path: '', section: '' };

    for (const section of sections) {
        for (const item of section.items) {
            // Check for exact match for dashboard
            if (item.path === '/app/cloud-edge' && url === item.path) {
                if (item.path.length > bestMatch.path.length) {
                    bestMatch = { path: item.path, section: section.title };
                }
            } 
            // Check for prefix match for others
            else if (item.path !== '/app/cloud-edge' && url.startsWith(item.path)) {
                if (item.path.length > bestMatch.path.length) {
                    bestMatch = { path: item.path, section: section.title };
                }
            }
        }
    }

    this.activeSectionTitle.set(bestMatch.section);
  }

  sidebarSections = computed<SidebarSection[]>(() => {
    let dashboardIcon = 'fas fa-home';
    const userRole = this.user()?.role;
    if (userRole === 'admin' || userRole === 'reseller') {
        dashboardIcon = 'fas fa-tachometer-alt';
    }

    return [
      { 
        title: '', 
        items: [
          { name: 'Dashboard', icon: dashboardIcon, path: '/app/cloud-edge' }
        ] 
      },
      { 
        title: 'Administration', 
        items: [
          { name: 'Organizations', icon: 'fas fa-building', path: '/app/cloud-edge/administration/organizations' },
        ] 
      },
      { 
        title: 'Resources', 
        items: [
          { name: 'Virtual Machines', icon: 'fas fa-desktop', path: '/app/cloud-edge/resources/virtual-machines' },
          { name: 'Storage', icon: 'fas fa-database', path: '/app/cloud-edge/resources/storage' },
          { name: 'Reservations', icon: 'fas fa-calendar-check', path: '/app/cloud-edge/resources/reservations' },
        ]
      },
      {
        title: 'Network',
        items: [
            { name: 'Gateways', icon: 'fas fa-dungeon', path: '/app/cloud-edge/network/gateways' },
            { name: 'NATs', icon: 'fas fa-network-wired', path: '/app/cloud-edge/network/nats' },
            { name: 'Reserved IP', icon: 'fas fa-location-dot', path: '/app/cloud-edge/network/reserved-ip' },
            { name: 'Routes', icon: 'fas fa-route', path: '/app/cloud-edge/network/routes' },
        ]
      },
      {
        title: 'Inventory',
        items: [
            { name: 'Applications', icon: 'far fa-file-alt', path: '/app/cloud-edge/inventory/applications' },
            { name: 'Groups', icon: 'fas fa-layer-group', path: '/app/cloud-edge/inventory/firewall-groups' },
            { name: 'Services', icon: 'fas fa-concierge-bell', path: '/app/cloud-edge/inventory/firewall-services' }
        ]
      },
      { 
        title: 'Security',
        items: [
            { name: 'IDS/IPS', icon: 'fas fa-shield-alt', path: '/app/cloud-edge/security/ids-ips' },
            { name: 'Filtering and Analysis', icon: 'fas fa-filter', path: '/app/cloud-edge/security/filtering-analysis' },
            { name: 'Distributed Firewall', icon: 'fas fa-project-diagram', path: '/app/cloud-edge/security/distributed-firewall' },
            { name: 'Gateway Firewall', icon: 'fas fa-dungeon', path: '/app/cloud-edge/security/gateway-firewall' },
            { name: 'IDS/IPS & Malware Prevention', icon: 'fas fa-bug', path: '/app/cloud-edge/security/ids-ips-malware-prevention' },
        ]
      },
      {
          title: 'Operations',
          items: [
              { name: 'Scheduled Tasks', icon: 'fas fa-clock', path: '/app/cloud-edge/operations/scheduled-tasks' },
              { name: 'Running Tasks', icon: 'fas fa-tasks', path: '/app/cloud-edge/operations/running-tasks' },
          ]
      }
    ];
  });
}
