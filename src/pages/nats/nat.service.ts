import { Injectable, signal } from '@angular/core';
import { NatRule } from './nats.types';

const MOCK_NAT_RULES: NatRule[] = [
  {
    id: 'nat-1',
    name: 'Web-Server-Public-Access',
    reservation: 'Web-Tier-Reservation',
    actionType: 'DNAT',
    source: 'Any',
    destination: '203.0.113.10',
    translated: '192.168.1.10',
    service: 'HTTPS',
    description: 'Allow public access to the main web server.',
    status: 'Enabled',
  },
  {
    id: 'nat-2',
    name: 'Outbound-Traffic-SNAT',
    reservation: 'Web-Tier-Reservation',
    actionType: 'SNAT',
    source: '192.168.1.0/24',
    destination: 'Any',
    translated: '203.0.113.1',
    service: 'Any',
    description: 'Masquerade internal traffic for outbound connections.',
    status: 'Enabled',
  },
  {
    id: 'nat-3',
    name: 'No-SNAT-for-VPN',
    reservation: null,
    actionType: 'NO SNAT',
    source: '192.168.1.0/24',
    destination: '10.10.0.0/16',
    translated: 'N/A',
    service: 'Any',
    description: 'Prevent SNAT for traffic going to the corporate VPN.',
    status: 'Enabled',
  },
  {
    id: 'nat-4',
    name: 'Staging-Server-DNAT',
    reservation: null,
    actionType: 'DNAT',
    source: 'Any',
    destination: '203.0.113.11',
    translated: '192.168.2.20:8080',
    service: 'HTTP',
    description: 'Port forwarding for the staging web server.',
    status: 'Disabled',
  },
];


@Injectable({ providedIn: 'root' })
export class NatService {
  private natRulesState = signal<NatRule[]>(MOCK_NAT_RULES);
  
  natRules = this.natRulesState.asReadonly();

  deleteNatRule(id: string): void {
    this.natRulesState.update(rules => rules.filter(r => r.id !== id));
  }
}
