import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { NavItem, BreadcrumbItem } from '../../types';
import { CloudEdgeSidebarComponent } from './components/sidebar/sidebar.component';
import { CloudEdgeTopBarComponent } from './components/top-bar/top-bar.component';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-cloud-edge-layout',
  templateUrl: './cloud-edge-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CloudEdgeSidebarComponent, CloudEdgeTopBarComponent, RouterOutlet, BreadcrumbsComponent],
})
export class CloudEdgeLayoutComponent {
  private authService = inject(AuthService);
  // Explicitly type router to fix a type inference issue where it was being inferred as 'unknown'.
  private router: Router = inject(Router);

  isSidebarCollapsed = signal<boolean>(localStorage.getItem('cloudEdgeSidebarCollapsed') === 'true');
  
  user = this.authService.user;
  
  appLauncherItems = computed(() => this.authService.getAppLauncherItems(this.user()?.role));

  breadcrumbItems = signal<BreadcrumbItem[]>([]);

  constructor() {
    effect(() => {
      localStorage.setItem('cloudEdgeSidebarCollapsed', String(this.isSidebarCollapsed()));
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateBreadcrumbs(event.urlAfterRedirects);
    });

    this.updateBreadcrumbs(this.router.url);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  private updateBreadcrumbs(url: string): void {
    const urlWithoutHash = url.startsWith('/#') ? url.substring(2) : url;
    const pathnames = urlWithoutHash.split('?')[0].split('/').filter(x => x && x !== 'app');

    const BREADCRUMB_LABELS: { [key: string]: string } = {
        'cloud-edge': 'CloudEdge', 'security': 'Security', 'overview': 'Security Overview',
        'ids-ips': 'IDS/IPS', 'suspicious-traffic': 'Suspicious Traffic', 'filtering-analysis': 'Filtering and Analysis',
        'distributed-firewall': 'Distributed Firewall', 'gateway-firewall': 'Gateway Firewall', 'ids-ips-malware-prevention': 'IDS/IPS & Malware Prevention',
        'administration': 'Administration', 'organizations': 'Organizations', 'applications': 'Applications'
    };

    const getLabel = (value: string) => BREADCRUMB_LABELS[value] || value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (!pathnames.includes('cloud-edge')) {
        this.breadcrumbItems.set([]);
        return;
    };

    const crumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/app/cloud-edge' }];
    const segmentsToProcess = pathnames.slice(1); 

    segmentsToProcess.forEach((value, index) => {
        const to = `/app/cloud-edge/${segmentsToProcess.slice(0, index + 1).join('/')}`;
        const label = getLabel(value);
        crumbs.push({ label, path: to });
    });

    if (crumbs.length > 1) {
        delete crumbs[crumbs.length - 1].path;
    }

    this.breadcrumbItems.set(crumbs);
  }
}