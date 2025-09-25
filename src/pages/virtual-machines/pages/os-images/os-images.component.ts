
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VmCreationService } from '../../services/vm-creation.service';

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
export class OsImagesComponent {
  private router = inject(Router);
  private vmCreationService = inject(VmCreationService);

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
    }
  ]);

  selectImage(image: OsImage): void {
    const selectedBlueprint = `${image.name} ${image.selectedVersion}`;
    this.vmCreationService.osBlueprint.set(selectedBlueprint);
    
    console.log(`Selected Image: ${image.name}, Version: ${image.selectedVersion}`);
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
}
