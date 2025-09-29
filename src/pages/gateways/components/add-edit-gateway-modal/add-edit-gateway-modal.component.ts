
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
// FIX: Update the import path for the Gateway type from '../../gateways.component' to '../../gateways.types' to resolve the import error.
import { Gateway } from '../../gateways.types';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';

export type GatewayFormData = {
  name: string;
  reservation: string | null;
  gatewayAddress: { octet1: string, octet2: string, octet3: string, octet4: string, cidr: number };
  createDhcp: boolean;
  dhcpAddress: { octet1: string, octet2: string, octet3: string, octet4: string, cidr: number };
  rangeFrom: string;
  rangeTo: string;
  dnsAddress: string;
  leaseTime: string | number;
  description: string;
};

@Component({
  selector: 'app-add-edit-gateway-modal',
  templateUrl: './add-edit-gateway-modal.component.html',
  styleUrls: ['./add-edit-gateway-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, ToggleSwitchComponent]
})
export class AddEditGatewayModalComponent {
  isOpen = input.required<boolean>();
  gatewayToEdit = input<Gateway | null>();
  
  close = output<void>();
  save = output<GatewayFormData>();

  private fb = inject(FormBuilder);
  gatewayForm: FormGroup;

  reservations = signal(['Ateff', 'Reservation B', 'Reservation C']); // Mock data
  cidrPrefixes = Array.from({ length: 33 }, (_, i) => i); // 0-32

  isEditMode = computed(() => !!this.gatewayToEdit());

  constructor() {
    this.gatewayForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(61)]],
      reservation: [null, Validators.required],
      gatewayAddress: this.fb.group({
        octet1: ['', [Validators.required, Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        octet2: ['', [Validators.required, Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        octet3: ['', [Validators.required, Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        octet4: ['', [Validators.required, Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        cidr: [24, Validators.required]
      }),
      createDhcp: [true],
      dhcpAddress: this.fb.group({
        octet1: ['', [Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        octet2: ['', [Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        octet3: ['', [Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        octet4: ['', [Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]],
        cidr: [{ value: 24, disabled: true }]
      }),
      rangeFrom: [''],
      rangeTo: [''],
      dnsAddress: [''],
      leaseTime: [''],
      description: ['']
    });

    // Sync gateway CIDR with DHCP CIDR
    // FIX: Replaced incorrect `group()` method with `get()` to access form controls.
    this.gatewayForm.get('gatewayAddress.cidr')?.valueChanges.subscribe(value => {
      // FIX: Replaced incorrect `group()` method with `get()` to access form controls.
      this.gatewayForm.get('dhcpAddress.cidr')?.setValue(value);
    });

    // Add/remove validators based on DHCP toggle
    // FIX: Replaced incorrect `group()` method with `get()` to access form controls.
    this.gatewayForm.get('createDhcp')?.valueChanges.subscribe(enabled => {
      const dhcpControls = ['rangeFrom', 'rangeTo', 'dnsAddress', 'leaseTime'];
      const dhcpAddressGroup = this.gatewayForm.get('dhcpAddress') as FormGroup;

      if (enabled) {
        dhcpControls.forEach(controlName => this.gatewayForm.get(controlName)?.setValidators(Validators.required));
        Object.keys(dhcpAddressGroup.controls).forEach(key => {
            if(key !== 'cidr') {
                dhcpAddressGroup.get(key)?.setValidators([Validators.required, Validators.min(0), Validators.max(255), Validators.pattern('^[0-9]*$')]);
            }
        });
      } else {
        dhcpControls.forEach(controlName => this.gatewayForm.get(controlName)?.clearValidators());
        Object.keys(dhcpAddressGroup.controls).forEach(key => {
            dhcpAddressGroup.get(key)?.clearValidators();
        });
      }
      dhcpControls.forEach(controlName => this.gatewayForm.get(controlName)?.updateValueAndValidity());
      dhcpAddressGroup.updateValueAndValidity();
    });
    // Trigger initial validator setup
    this.gatewayForm.get('createDhcp')?.updateValueAndValidity();


    effect(() => {
      if (this.isOpen()) {
        const gw = this.gatewayToEdit();
        if (gw) { // Edit mode
          const [ip, cidr] = (gw.subnet || '.../24').split('/');
          const octets = ip.split('.');
          
          const dhcpIp = gw.dhcp?.dhcpAddress?.split('/')[0] || '';
          const dhcpOctets = dhcpIp.split('.');

          this.gatewayForm.patchValue({
            name: gw.name,
            reservation: gw.reservation,
            description: gw.description,
            gatewayAddress: {
              octet1: octets[0] || '',
              octet2: octets[1] || '',
              octet3: octets[2] || '',
              octet4: octets[3] || '',
              cidr: cidr ? parseInt(cidr, 10) : 24,
            },
            createDhcp: gw.dhcp?.enabled || false,
             dhcpAddress: {
                octet1: dhcpOctets[0] || '',
                octet2: dhcpOctets[1] || '',
                octet3: dhcpOctets[2] || '',
                octet4: dhcpOctets[3] || '',
              },
              rangeFrom: gw.dhcp?.rangeFrom || '',
              rangeTo: gw.dhcp?.rangeTo || '',
              dnsAddress: gw.dhcp?.dnsAddress || '',
              leaseTime: gw.dhcp?.leaseTime || '',
          });
          this.gatewayForm.get('dhcpAddress.cidr')?.setValue(cidr ? parseInt(cidr, 10) : 24);

        } else { // Create mode
          this.gatewayForm.reset({
            name: '',
            reservation: 'Ateff',
            gatewayAddress: { octet1: '', octet2: '', octet3: '', octet4: '', cidr: 24 },
            createDhcp: true,
            dhcpAddress: { octet1: '', octet2: '', octet3: '', octet4: '', cidr: 24 },
            rangeFrom: '', rangeTo: '', dnsAddress: '', leaseTime: '',
            description: ''
          });
        }
         this.gatewayForm.markAsPristine();
         this.gatewayForm.markAsUntouched();
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.gatewayForm.valid) {
      this.save.emit(this.gatewayForm.getRawValue());
    } else {
      this.gatewayForm.markAllAsTouched();
    }
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
