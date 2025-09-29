
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { VmCreationService } from '../../services/vm-creation.service';

@Component({
  selector: 'app-create-vm',
  templateUrl: './create-vm.component.html',
  styleUrls: ['./create-vm.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, RouterModule],
})
export class CreateVmComponent {
  // FIX: Explicitly type `Router` to prevent it from being inferred as `unknown`.
  private router: Router = inject(Router);
  vmCreationService = inject(VmCreationService);

  reservations = ['Default Reservation', 'High-Performance Reservation', 'Storage-Optimized Reservation'];
  groups = ['Default Group', 'Web Servers', 'Database Servers'];
  gateways = ['Default Gateway', 'DMZ Gateway', 'Internal Gateway'];

  recentOsBlueprints = [
    'Ubuntu 22.04 LTS',
    'Windows Server 2022 Datacenter',
    'CentOS Stream 9',
    'Debian 12',
    'Red Hat Enterprise Linux 9'
  ];

  osBlueprintOptions = computed(() => {
    const selected = this.vmCreationService.osBlueprint();
    const recent = this.recentOsBlueprints;
    if (selected && !recent.includes(selected)) {
      return [selected, ...recent];
    }
    return recent;
  });


  addDisk(): void {
    this.vmCreationService.disks.update(disks => [...disks, { name: `Disk-0${disks.length + 1}`, size: 100 }]);
  }

  removeDisk(index: number): void {
    this.vmCreationService.disks.update(disks => disks.filter((_, i) => i !== index));
  }

  updateDiskProperty(index: number, field: 'name' | 'size', value: string | number): void {
    this.vmCreationService.disks.update(disks => {
      const newDisks = [...disks];
      const diskToUpdate = { ...newDisks[index] };
      
      if (field === 'name') {
        diskToUpdate.name = value as string;
      } else if (field === 'size') {
        diskToUpdate.size = Number(value);
      }
      
      newDisks[index] = diskToUpdate;
      return newDisks;
    });
  }

  cancel(): void {
    this.vmCreationService.reset();
    this.router.navigate(['/app/cloud-edge/resources/virtual-machines']);
  }

  createVm(): void {
    // In a real app, this would submit the form data to a service
    console.log('Creating VM with the following data:', {
      vmName: this.vmCreationService.vmName(),
      reservation: this.vmCreationService.reservation(),
      group: this.vmCreationService.group(),
      osBlueprint: this.vmCreationService.osBlueprint(),
      hostName: this.vmCreationService.hostName(),
      password: '****', // Don't log passwords
      gateway: this.vmCreationService.gateway(),
      cpu: this.vmCreationService.cpu(),
      memory: this.vmCreationService.memory(),
      disks: this.vmCreationService.disks(),
      description: this.vmCreationService.description(),
    });
    
    this.vmCreationService.reset();
    // For demo purposes, navigate back to the list
    this.router.navigate(['/app/cloud-edge/resources/virtual-machines']);
  }
}
