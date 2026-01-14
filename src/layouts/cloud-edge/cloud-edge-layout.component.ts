import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthService } from '../../services/auth.service';
import { BreadcrumbItem } from '../../types';
import { CloudEdgeSidebarComponent } from './components/sidebar/sidebar.component';
import { CloudEdgeTopBarComponent } from './components/top-bar/top-bar.component';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MarketplaceService } from '../../pages/marketplace/services/marketplace.service';
import { ForumService } from '../../pages/community-forum/forum.service';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-cloud-edge-layout',
  templateUrl: './cloud-edge-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CloudEdgeSidebarComponent, CloudEdgeTopBarComponent, RouterOutlet, BreadcrumbsComponent, CommonModule, IconComponent],
})
export class CloudEdgeLayoutComponent {
  @ViewChild(RouterOutlet) outlet!: RouterOutlet;
  private authService = inject(AuthService);
  // FIX: Explicitly type router to fix a type inference issue where it was being inferred as 'unknown'.
  private router: Router = inject(Router);
  private marketplaceService = inject(MarketplaceService);
  private forumService = inject(ForumService);

  isSidebarCollapsed = signal<boolean>(localStorage.getItem('cloudEdgeSidebarCollapsed') === 'true');
  
  user = this.authService.user;
  
  appLauncherItems = computed(() => this.authService.getAppLauncherItems(this.user()?.role));

  breadcrumbItems = signal<BreadcrumbItem[]>([]);
  isGettingStartedPage = signal(false);
  isDistributedFirewallOldPage = signal(false);
  
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
      this.isGettingStartedPage.set(event.urlAfterRedirects.includes('getting-started'));
      this.isDistributedFirewallOldPage.set(event.urlAfterRedirects.endsWith('/distributed-firewall-old'));
    });

    this.updateBreadcrumbs(this.router.url);
    this.isGettingStartedPage.set(this.router.url.includes('getting-started'));
    this.isDistributedFirewallOldPage.set(this.router.url.endsWith('/distributed-firewall-old'));
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

  onAddPolicyClick(): void {
    if (this.outlet && this.outlet.isActivated) {
      const componentInstance = this.outlet.component as any;
      if (componentInstance && typeof componentInstance.handleAddPolicyClick === 'function') {
        componentInstance.handleAddPolicyClick();
      }
    }
  }

  private updateBreadcrumbs(url: string): void {
    const urlWithoutHash = url.startsWith('/#') ? url.substring(2) : url;
    const pathnames = urlWithoutHash.split('?')[0].split('/').filter(x => x && x !== 'app');

    const BREADCRUMB_LABELS: { [key: string]: string } = {
        'cloud-edge': 'CloudEdge', 'security': 'Security', 'overview': 'Security Overview',
        'hub': 'Security Hub', 'suspicious-traffic': 'Suspicious Traffic', 'filtering-analysis': 'Filtering and Analysis',
        'distributed-firewall': 'Distributed Firewall', 'distributed-firewall-old': 'Distributed Firewall', 'add-policy': 'Distributed Firewall Policy', 'gateway-firewall': 'Gateway Firewall', 'hub-malware-prevention': 'IDS/IPS & Malware Prevention',
        'administration': 'Administration', 'organizations': 'Organizations', 'applications': 'Applications', 'inventory': 'Inventory',
        'firewall-groups': 'Groups', 'firewall-services': 'Services', 'virtual-machines': 'Virtual Machines',
        'create': 'Create Virtual Machine', 'images': 'Select OS Image', 'resources': 'Resources', 'network': 'Network',
        'operations': 'Operations', 'marketplace': 'Marketplace', 'community-forum': 'Community Forum'
    };

    const getLabel = (value: string) => BREADCRUMB_LABELS[value] || value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (!pathnames.includes('cloud-edge')) {
        this.breadcrumbItems.set([]);
        return;
    };

    // --- Special handling for Community Forum ---
    if (pathnames.includes('community-forum')) {
        const crumbs: BreadcrumbItem[] = [
            { label: 'Home', path: '/app/cloud-edge' },
            { label: 'Resources', path: '/app/cloud-edge/resources/virtual-machines' },
            { label: 'Community Forum', path: '/app/cloud-edge/resources/community-forum' },
        ];
        
        const topicIndex = pathnames.indexOf('topic');

        if (topicIndex !== -1 && topicIndex + 1 < pathnames.length) {
            const topicId = pathnames[topicIndex + 1];
            const topicData = this.forumService.getTopicById(topicId);
            if (topicData) {
                crumbs.push({ label: topicData.topic.title });
            }
        }

        if (crumbs.length > 1) {
            delete crumbs[crumbs.length - 1].path;
        }

        this.breadcrumbItems.set(crumbs);
        return;
    }

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
    const sectionPaths = ['administration', 'resources', 'network', 'inventory', 'security', 'operations'];

    let currentPath = '/app/cloud-edge';
    segmentsToProcess.forEach((value) => {
      // We still need to build the full path for links.
      const fullPathForSegment = currentPath + `/${value}`;
      currentPath = fullPathForSegment;

      // But we only add a breadcrumb item if it's not a section path.
      if (!sectionPaths.includes(value)) {
        const label = getLabel(value);
        crumbs.push({ label, path: fullPathForSegment });
      }
    });

    if (crumbs.length > 1) {
        delete crumbs[crumbs.length - 1].path;
    }

    this.breadcrumbItems.set(crumbs);
  }
}