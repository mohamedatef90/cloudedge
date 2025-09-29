import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MarketplaceService } from '../services/marketplace.service';
import { AuthService } from '../../../services/auth.service';
import { Category, MarketplaceItem } from '../models/marketplace.model';
import { VirtualMachineService } from '../../virtual-machines/services/virtual-machine.service';

@Component({
  selector: 'app-configure-app-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './configure-app-page.component.html',
  styleUrls: ['./configure-app-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigureAppPageComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private marketplaceService = inject(MarketplaceService);
  private authService = inject(AuthService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private virtualMachineService = inject(VirtualMachineService);

  item = signal<MarketplaceItem | undefined>(undefined);
  categories = signal<Category[]>([]);
  
  activeTab = signal<'overview' | 'configure' | 'reviews'>('overview');
  
  selectedStorage = signal(50);
  selectedRam = signal(4);
  selectedCores = signal(2);
  selectedBandwidth = signal(2);
  selectedOS = signal('');

  category = computed(() => {
    const itemCategory = this.item()?.category;
    if (!itemCategory) return undefined;
    return this.categories().find(c => c.id === itemCategory);
  });

  basePrice = computed(() => {
    return this.item()?.price.base ?? 0;
  });

  storagePrice = computed(() => {
    const currentItem = this.item();
    if (!currentItem) return 0;
    return this.selectedStorage() * currentItem.price.storagePerGB;
  });

  ramPrice = computed(() => {
    const currentItem = this.item();
    if (!currentItem) return 0;
    return this.selectedRam() * currentItem.price.ramPerGB;
  });

  coresPrice = computed(() => {
    const currentItem = this.item();
    if (!currentItem) return 0;
    return this.selectedCores() * currentItem.price.pricePerCore;
  });

  bandwidthPrice = computed(() => {
    const currentItem = this.item();
    if (!currentItem) return 0;
    return this.selectedBandwidth() * currentItem.price.bandwidthPerTB;
  });

  totalPrice = computed(() => {
    return this.basePrice() + this.storagePrice() + this.ramPrice() + this.coresPrice() + this.bandwidthPrice();
  });

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.marketplaceService.getItemById(itemId).subscribe(item => {
        if (item) {
          this.item.set(item);
          if (item.osOptions.length > 0) {
            this.selectedOS.set(item.osOptions[0]);
          }
        }
      });
    }
    this.marketplaceService.getCategories().subscribe(cats => this.categories.set(cats));
  }
  
  setActiveTab(tab: 'overview' | 'configure' | 'reviews') {
    this.activeTab.set(tab);
  }

  onStorageChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedStorage.set(Number(value));
  }
  
  onRamChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedRam.set(Number(value));
  }

  onCoresChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedCores.set(Number(value));
  }

  onBandwidthChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.selectedBandwidth.set(Number(value));
  }

  onOsChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedOS.set(value);
  }

  getItNow() {
    const currentItem = this.item();
    if (!currentItem) return;

    // Heuristic to determine OS type for the VM model
    let osType: 'windows' | 'ubuntu' | 'linux' = 'linux';
    const selectedOsLower = this.selectedOS().toLowerCase();
    if (selectedOsLower.includes('windows')) {
        osType = 'windows';
    } else if (selectedOsLower.includes('ubuntu')) {
        osType = 'ubuntu';
    }

    const newVmConfig = {
        name: `${currentItem.name} Instance`,
        os: osType,
        cores: this.selectedCores(),
        memory: this.selectedRam(),
        storage: this.selectedStorage(),
        description: `Deployed from Marketplace: ${currentItem.name}`
    };

    this.virtualMachineService.addVm(newVmConfig);
    this.router.navigate(['/app/cloud-edge/resources/virtual-machines']);
  }
  
  sanitizeIcon(svgContent: string | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent || '');
  }
}
