import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '../../services/auth.service';
import { BreadcrumbItem } from '../../types';
import { CloudEdgeSidebarComponent } from './components/sidebar/sidebar.component';
import { CloudEdgeTopBarComponent } from './components/top-bar/top-bar.component';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MarketplaceService } from '../../pages/marketplace/services/marketplace.service';

@Component({
  selector: 'app-cloud-edge-layout',
  templateUrl: './cloud-edge-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CloudEdgeSidebarComponent, CloudEdgeTopBarComponent, RouterOutlet, BreadcrumbsComponent],
})
export class CloudEdgeLayoutComponent {
  private authService = inject(AuthService);
  // FIX: Explicitly type router to fix a type inference issue where it was being inferred as 'unknown'.
  private router: Router = inject(Router);
  private marketplaceService = inject(MarketplaceService);

  isSidebarCollapsed = signal<boolean>(localStorage.getItem('cloudEdgeSidebarCollapsed') === 'true');
  
  user = this.authService.user;
  
  appLauncherItems = computed(() => this.authService.getAppLauncherItems(this.user()?.role));

  breadcrumbItems = signal<BreadcrumbItem[]>([]);
  
  private marketplaceItems = toSignal(this.marketplaceService.getItems(), { initialValue: [] });
  private marketplaceCategories = toSignal(this.marketplaceService.getCategories(), { initialValue: [] });

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
        'administration': 'Administration', 'organizations': 'Organizations', 'applications': 'Applications', 'inventory': 'Inventory',
        'firewall-groups': 'Groups', 'firewall-services': 'Services', 'virtual-machines': 'Virtual Machines',
        'create': 'Create Virtual Machine', 'images': 'Select OS Image', 'resources': 'Resources', 'network': 'Network',
        'operations': 'Operations', 'marketplace': 'Marketplace'
    };

    const getLabel = (value: string) => BREADCRUMB_LABELS[value] || value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (!pathnames.includes('cloud-edge')) {
        this.breadcrumbItems.set([]);
        return;
    };

    // --- Special handling for Marketplace ---
    if (pathnames.includes('marketplace')) {
        const crumbs: BreadcrumbItem[] = [
            { label: 'Home', path: '/app/cloud-edge' },
            { label: 'Resources', path: '/app/cloud-edge/resources/virtual-machines' },
            { label: 'Marketplace', path: '/app/cloud-edge/resources/marketplace' },
        ];
        
        const categoryIndex = pathnames.indexOf('category');
        const configureIndex = pathnames.indexOf('configure');

        if (categoryIndex !== -1 && categoryIndex + 1 < pathnames.length) {
            const categoryId = pathnames[categoryIndex + 1];
            const category = this.marketplaceCategories().find(c => c.id === categoryId);
            if (category) {
                crumbs.push({ label: category.name });
            }
        } else if (configureIndex !== -1 && configureIndex + 1 < pathnames.length) {
            const itemId = pathnames[configureIndex + 1];
            const item = this.marketplaceItems().find(i => i.id === itemId);
            if (item) {
                const category = this.marketplaceCategories().find(c => c.id === item.category);
                if (category) {
                    crumbs.push({ label: category.name, path: `/app/cloud-edge/resources/marketplace/category/${category.id}` });
                }
                crumbs.push({ label: item.name });
            }
        }

        if (crumbs.length > 1) {
            delete crumbs[crumbs.length - 1].path;
        }

        this.breadcrumbItems.set(crumbs);
        return;
    }


    const crumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/app/cloud-edge' }];
    const segmentsToProcess = pathnames.slice(1); 

    let fullPathSegments: string[] = [];
    segmentsToProcess.forEach((value) => {
      fullPathSegments.push(value);
      
      const to = `/app/cloud-edge/${fullPathSegments.join('/')}`;
      const label = getLabel(value);
      crumbs.push({ label, path: to });
    });

    if (crumbs.length > 1) {
        delete crumbs[crumbs.length - 1].path;
    }

    this.breadcrumbItems.set(crumbs);
  }
}
