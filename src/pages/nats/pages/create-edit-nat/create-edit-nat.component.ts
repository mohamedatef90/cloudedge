
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { IconComponent } from '../../../../components/icon/icon.component';
import { NatService } from '../../nat.service';
import { NatRule } from '../../nats.types';
import { GatewayService } from '../../../gateways/gateway.service';
import { Gateway } from '../../../gateways/gateways.types';

@Component({
  selector: 'app-create-edit-nat',
  templateUrl: './create-edit-nat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, IconComponent, CommonModule, ReactiveFormsModule]
})
export class CreateEditNatComponent implements OnInit {
  private fb = inject(FormBuilder);
  // FIX: Explicitly type injected services to avoid `unknown` type inference.
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private natService = inject(NatService);
  private gatewayService = inject(GatewayService);

  natForm: FormGroup;
  gateways = this.gatewayService.gateways;
  elasticIps = ['85.195.99.176', '102.55.23.1', '99.4.123.55'];
  natTypes: NatRule['actionType'][] = ['DNAT', 'SNAT', 'NO SNAT', 'NO DNAT', 'REFLEXIVE'];
  cidrPrefixes = Array.from({ length: 33 }, (_, i) => i);

  private natRuleId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
  isEditMode = computed(() => !!this.natRuleId());

  constructor() {
    this.natForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type: ['SNAT', Validators.required],
      gateway: ['', Validators.required],
      gatewayAddress: this.fb.group({
        octet1: [{ value: '', disabled: true }],
        octet2: [{ value: '', disabled: true }],
        octet3: [{ value: '', disabled: true }],
        octet4: [{ value: '', disabled: true }],
        cidr: [{ value: 24, disabled: true }]
      }),
      elasticIp: ['', Validators.required],
      port: [''],
      description: ['']
    });

    // FIX: Replaced incorrect `group()` method with `get()` to access form controls.
    this.natForm.get('gateway')?.valueChanges.subscribe(gatewayName => {
      const selectedGateway = this.gateways().find(g => g.name === gatewayName);
      if (selectedGateway) {
        const [ip, cidr] = selectedGateway.subnet.split('/');
        const octets = ip.split('.');
        // FIX: Replaced incorrect `group()` method with `get()` to access form controls.
        this.natForm.get('gatewayAddress')?.patchValue({
          octet1: octets[0] || '',
          octet2: octets[1] || '',
          octet3: octets[2] || '',
          octet4: octets[3] || '',
          cidr: cidr ? parseInt(cidr, 10) : 24
        });
      }
    });
  }

  ngOnInit(): void {
    const id = this.natRuleId();
    if (id) {
      // In a real app, you would fetch the rule by ID and patch the form
      // For now, we'll keep it simple for the create UI
    } else {
        // Pre-fill some data to match the screenshot
        this.natForm.patchValue({
            type: 'SNAT',
            gateway: 'Atef_192',
            elasticIp: '85.195.99.176'
        });
    }
  }

  onSave(): void {
    if (this.natForm.valid) {
      // In a real app, this would call the natService to save the data
      console.log('Saving NAT Rule:', this.natForm.value);
      this.router.navigate(['/app/cloud-edge/network/nats']);
    } else {
      this.natForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/cloud-edge/network/nats']);
  }
}
