import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ProfilesService } from '../../services/profiles.service';

@Component({
  selector: 'app-add-context-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './add-context-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddContextProfileComponent {
  private router = inject(Router);
  private profilesService = inject(ProfilesService);

  profileName = signal('');
  
  // AppId State
  appIdSearch = signal('');
  availableAppIds = signal(['17173', '247INC', '247MEDIA', '2CHANNEL']);
  addedAppIds = signal<string[]>([]);

  // Domain State
  domainSearch = signal('');
  availableDomains = signal(['*.google.com', '*.microsoft.com', '*.amazon.com', '*.apple.com']);
  addedDomains = signal<string[]>([]);
  isAddDomainModalOpen = signal(false);
  newDomainValue = signal('');

  // Custom URL State
  customUrlSearch = signal('');
  availableCustomUrls = signal(['www.example.com', 'www.ec.com', 'ac.df.cv', 'www.ex2.com']);
  addedCustomUrls = signal<string[]>([]);
  isAddCustomUrlModalOpen = signal(false);
  newCustomUrlValue = signal('');

  // Methods for AppId
  addAppId(item: string) {
    if (!this.addedAppIds().includes(item)) {
      this.addedAppIds.update(val => [...val, item]);
    }
  }
  removeAppId(item: string) {
    this.addedAppIds.update(val => val.filter(i => i !== item));
  }
  get filteredAppIds() {
    const search = this.appIdSearch().toLowerCase();
    return this.availableAppIds().filter(app => app.toLowerCase().includes(search));
  }

  // Methods for Domain
  addDomain(item: string) {
    if (!this.addedDomains().includes(item)) {
      this.addedDomains.update(val => [...val, item]);
    }
  }
  removeDomain(item: string) {
    this.addedDomains.update(val => val.filter(i => i !== item));
  }
  get filteredDomains() {
    const search = this.domainSearch().toLowerCase();
    return this.availableDomains().filter(domain => domain.toLowerCase().includes(search));
  }
  saveNewDomain() {
    const val = this.newDomainValue().trim();
    if (val && !this.availableDomains().includes(val)) {
      this.availableDomains.update(domains => [val, ...domains]);
      this.addDomain(val);
    }
    this.isAddDomainModalOpen.set(false);
    this.newDomainValue.set('');
  }

  // Methods for Custom URL
  addCustomUrl(item: string) {
    if (!this.addedCustomUrls().includes(item)) {
      this.addedCustomUrls.update(val => [...val, item]);
    }
  }
  removeCustomUrl(item: string) {
    this.addedCustomUrls.update(val => val.filter(i => i !== item));
  }
  get filteredCustomUrls() {
    const search = this.customUrlSearch().toLowerCase();
    return this.availableCustomUrls().filter(url => url.toLowerCase().includes(search));
  }
  saveNewCustomUrl() {
    const val = this.newCustomUrlValue().trim();
    if (val && !this.availableCustomUrls().includes(val)) {
      this.availableCustomUrls.update(urls => [val, ...urls]);
      this.addCustomUrl(val);
    }
    this.isAddCustomUrlModalOpen.set(false);
    this.newCustomUrlValue.set('');
  }

  cancel() {
    this.router.navigate(['/app/cloud-edge/administration/profiles']);
  }

  save() {
    this.profilesService.addProfile({
      name: this.profileName() || 'Untitled Profile',
      type: 'Context Profile'
    });
    this.router.navigate(['/app/cloud-edge/administration/profiles']);
  }
}
