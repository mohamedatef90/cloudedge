
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { Gateway, GatewayFormData } from '../../gateways.types';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { GatewayService } from '../../gateway.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-create-edit-gateway',
  templateUrl: './create-edit-gateway.component.html',
  styleUrls: ['./create-edit-gateway.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, ToggleSwitchComponent, RouterModule]
})
export class CreateEditGatewayComponent implements OnInit {
  private fb = inject(FormBuilder);
  // FIX: Explicitly type injected services to avoid `unknown` type inference.
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private gatewayService = inject(GatewayService);
  
  gatewayForm: FormGroup;
  
  reservations = ['Ateff', 'Reservation B', 'Reservation C']; // Mock data
  cidrPrefixes = Array.from({ length: 33 }, (_, i) => i); // 0-32

  private gatewayId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
  isEditMode = computed(() => !!this.gatewayId());

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

    // FIX: Replaced incorrect `group()` method with `get()` to access form controls.
    this.gatewayForm.get('gatewayAddress.cidr')?.valueChanges.subscribe(value => {
      // FIX: Replaced incorrect `group()` method with `get()` to access form controls.
      this.gatewayForm.get('dhcpAddress.cidr')?.setValue(value);
    });

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
        Object.keys(dhcpAddressGroup.controls).forEach(key => dhcpAddressGroup.get(key)?.clearValidators());
      }
      dhcpControls.forEach(controlName => this.gatewayForm.get(controlName)?.updateValueAndValidity());
      dhcpAddressGroup.updateValueAndValidity();
    });

    this.gatewayForm.get('createDhcp')?.updateValueAndValidity();
  }

  ngOnInit(): void {
    const id = this.gatewayId();
    if (id) {
      const gw = this.gatewayService.getGatewayById(id);
      if (gw) {
        this.patchFormWithGatewayData(gw);
      } else {
        // Handle gateway not found, maybe redirect
        this.onCancel();
      }
    } else {
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
  }

  private patchFormWithGatewayData(gw: Gateway): void {
    const [ip, cidr] = (gw.subnet || '.../24').split('/');
    const octets = ip.split('.');
    
    const dhcpIp = gw.dhcp?.dhcpAddress?.split('/')[0] || '';
    const dhcpOctets = dhcpIp.split('.');
    const cidrValue = cidr ? parseInt(cidr, 10) : 24;

    this.gatewayForm.patchValue({
      name: gw.name,
      reservation: gw.reservation,
      description: gw.description,
      gatewayAddress: {
        octet1: octets[0] || '', octet2: octets[1] || '',
        octet3: octets[2] || '', octet4: octets[3] || '',
        cidr: cidrValue,
      },
      createDhcp: gw.dhcp?.enabled || false,
      dhcpAddress: {
        octet1: dhcpOctets[0] || '', octet2: dhcpOctets[1] || '',
        octet3: dhcpOctets[2] || '', octet4: dhcpOctets[3] || '',
      },
      rangeFrom: gw.dhcp?.rangeFrom || '',
      rangeTo: gw.dhcp?.rangeTo || '',
      dnsAddress: gw.dhcp?.dnsAddress || '',
      leaseTime: gw.dhcp?.leaseTime || '',
    });
    this.gatewayForm.get('dhcpAddress.cidr')?.setValue(cidrValue);
  }

  onSave(): void {
    if (this.gatewayForm.valid) {
      const formData = this.gatewayForm.getRawValue() as GatewayFormData;
      const id = this.gatewayId();
      if (id) {
        this.gatewayService.updateGateway(id, formData);
      } else {
        this.gatewayService.addGateway(formData);
      }
      this.router.navigate(['/app/cloud-edge/network/gateways']);
    } else {
      this.gatewayForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/cloud-edge/network/gateways']);
  }
}
