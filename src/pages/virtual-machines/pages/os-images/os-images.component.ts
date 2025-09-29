
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VmCreationService } from '../../services/vm-creation.service';
import { MarketplaceService } from '../../../marketplace/services/marketplace.service';
import { MarketplaceItem, Category } from '../../../marketplace/models/marketplace.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface OsImage {
  id: string;
  name: string;
  icon: string;
  iconClasses?: string;
  versions: string[];
  selectedVersion: string;
}

@Component({
  selector: 'app-os-images',
  templateUrl: './os-images.component.html',
  styleUrls: ['./os-images.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, RouterModule],
})
export class OsImagesComponent implements OnInit {
  // FIX: Explicitly type injected services to avoid `unknown` type inference.
  private router: Router = inject(Router);
  private vmCreationService = inject(VmCreationService);
  private marketplaceService = inject(MarketplaceService);
  // FIX: Explicitly type injected services to avoid `unknown` type inference.
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  activeTab = signal<'os' | 'marketplace'>('os');

  marketplaceItems = signal<MarketplaceItem[]>([]);
  categories = signal<Category[]>([]);
  searchTerm = signal('');
  selectedCategoryId = signal<string | null>(null);

  osImages = signal<OsImage[]>([
    {
      id: 'win-server', name: 'Windows Server', icon: 'fab fa-windows', iconClasses: 'text-blue-500',
      versions: ['2022 Datacenter', '2019 Datacenter', '2016 Standard'], selectedVersion: '2022 Datacenter'
    },
    {
      id: 'ubuntu', name: 'Ubuntu Server', icon: 'fab fa-ubuntu', iconClasses: 'text-orange-500',
      versions: ['24.04 LTS', '22.04 LTS', '20.04 LTS'], selectedVersion: '24.04 LTS'
    },
    {
      id: 'rhel', name: 'Red Hat Enterprise Linux', icon: 'fab fa-redhat', iconClasses: 'text-red-600',
      versions: ['9', '8', '7'], selectedVersion: '9'
    },
    {
      id: 'centos', name: 'CentOS Stream', icon: 'fab fa-centos', iconClasses: 'text-purple-600',
      versions: ['9', '8'], selectedVersion: '9'
    },
    {
      id: 'debian', name: 'Debian', icon: 'fab fa-debian', iconClasses: 'text-red-500',
      versions: ['12 (Bookworm)', '11 (Bullseye)'], selectedVersion: '12 (Bookworm)'
    },
    {
      id: 'fedora', name: 'Fedora Server', icon: 'fab fa-fedora', iconClasses: 'text-blue-700',
      versions: ['40', '39'], selectedVersion: '40'
    },
    {
      id: 'almalinux', name: 'AlmaLinux', icon: 'fab fa-linux', iconClasses: 'text-green-600',
      versions: ['9', '8'], selectedVersion: '9'
    },
    {
      id: 'rocky', name: 'Rocky Linux', icon: 'fab fa-linux', iconClasses: 'text-teal-600',
      versions: ['9', '8'], selectedVersion: '9'
    },
    {
      id: 'sles', name: 'SUSE Linux Enterprise', icon: 'fab fa-suse', iconClasses: 'text-green-500',
      versions: ['15 SP6', '15 SP5'], selectedVersion: '15 SP6'
    },
    {
      id: 'freebsd', name: 'FreeBSD', icon: 'fab fa-freebsd', iconClasses: 'text-red-700',
      versions: ['14.1', '13.3'], selectedVersion: '14.1'
    },
    {
      id: 'oracle', name: 'Oracle Linux', icon: 'fab fa-linux', iconClasses: 'text-red-800',
      versions: ['9', '8'], selectedVersion: '9'
    },
    {
      id: 'arch', name: 'Arch Linux', icon: 'fab fa-linux', iconClasses: 'text-sky-600',
      versions: ['Latest'], selectedVersion: 'Latest'
    },
    {
      id: 'alpine', name: 'Alpine Linux', icon: 'fab fa-linux', iconClasses: 'text-blue-900',
      versions: ['3.20', '3.19'], selectedVersion: '3.20'
    },
    {
      id: 'kali', name: 'Kali Linux', icon: 'fab fa-linux', iconClasses: 'text-black dark:text-white',
      versions: ['2024.2', '2024.1'], selectedVersion: '2024.2'
    },
    {
      id: 'pfsense', name: 'pfSense', icon: 'fas fa-shield-alt', iconClasses: 'text-red-700',
      versions: ['Plus 24.03', 'CE 2.7.2'], selectedVersion: 'Plus 24.03'
    },
    {
      id: 'truenas', name: 'TrueNAS CORE', icon: 'fas fa-server', iconClasses: 'text-blue-800',
      versions: ['13.0-U6.1', '13.0-U5.3'], selectedVersion: '13.0-U6.1'
    },
    {
      id: 'photon', name: 'VMware Photon OS', icon: 'fas fa-compact-disc', iconClasses: 'text-indigo-600',
      versions: ['5.0', '4.0'], selectedVersion: '5.0'
    },
    {
      id: 'cloudlinux', name: 'CloudLinux OS', icon: 'fab fa-linux', iconClasses: 'text-green-700',
      versions: ['9', '8'], selectedVersion: '9'
    },
    {
      id: 'openmediavault', name: 'OpenMediaVault', icon: 'fas fa-hdd', iconClasses: 'text-gray-600',
      versions: ['7 (Sandworm)', '6 (Shaitan)'], selectedVersion: '7 (Sandworm)'
    },
    {
      id: 'vyos', name: 'VyOS', icon: 'fas fa-network-wired', iconClasses: 'text-purple-700',
      versions: ['1.4 (Sagitta)', '1.3 (Equuleus)'], selectedVersion: '1.4 (Sagitta)'
    }
  ]);

  filteredMarketplaceItems = computed(() => {
    const categoryId = this.selectedCategoryId();
    const term = this.searchTerm().toLowerCase();

    return this.marketplaceItems().filter(item => {
      const categoryMatch = !categoryId || item.category === categoryId;
      const searchTermMatch = !term ||
                              item.name.toLowerCase().includes(term) ||
                              item.description.toLowerCase().includes(term);
      return categoryMatch && searchTermMatch;
    });
  });

  ngOnInit(): void {
    this.marketplaceService.getItems().subscribe(items => this.marketplaceItems.set(items));
    this.marketplaceService.getCategories().subscribe(categories => this.categories.set(categories));
  }

  setActiveTab(tab: 'os' | 'marketplace'): void {
    this.activeTab.set(tab);
  }

  sanitizeIcon(svgContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

  selectImage(image: OsImage): void {
    const selectedBlueprint = `${image.name} ${image.selectedVersion}`;
    this.vmCreationService.osBlueprint.set(selectedBlueprint);
    
    this.router.navigate(['/app/cloud-edge/resources/virtual-machines/create']);
  }

  selectMarketplaceItem(item: MarketplaceItem): void {
    this.vmCreationService.osBlueprint.set(item.name);
    this.router.navigate(['/app/cloud-edge/resources/virtual-machines/create']);
  }

  onVersionChange(imageId: string, event: Event): void {
    const selectedVersion = (event.target as HTMLSelectElement).value;
    this.osImages.update(images => 
      images.map(img => 
        img.id === imageId ? { ...img, selectedVersion } : img
      )
    );
  }
  
  selectCategory(categoryId: string | null): void {
    this.selectedCategoryId.set(categoryId);
  }
}
