

import { Injectable, signal } from '@angular/core';
import { Gateway, GatewayFormData } from './gateways.types';

@Injectable({ providedIn: 'root' })
export class GatewayService {
  private gatewaysState = signal<Gateway[]>([
    { id: 'gw-1', name: 'Primary-Edge-Gateway', reservation: 'Web-Tier-Reservation', subnet: '192.168.1.1/24', description: 'Main gateway for production web traffic.' },
    { id: 'gw-2', name: 'Dev-Internal-Gateway', reservation: null, subnet: '10.0.0.1/24', description: 'Gateway for internal development network.' },
    { id: 'gw-3', name: 'DMZ-Gateway', reservation: 'Security-Zone-Reservation', subnet: '172.16.0.1/24', description: 'Gateway for the demilitarized zone.' },
    { id: 'gw-4', name: 'Backup-Site-Gateway', reservation: null, subnet: '192.168.100.1/24', description: 'Gateway for disaster recovery site.' },
  ]);

  gateways = this.gatewaysState.asReadonly();

  getGatewayById(id: string): Gateway | undefined {
    return this.gateways().find(gw => gw.id === id);
  }
  
  private transformFormDataToGateway(formData: GatewayFormData, id?: string): Gateway {
    const subnet = `${formData.gatewayAddress.octet1}.${formData.gatewayAddress.octet2}.${formData.gatewayAddress.octet3}.${formData.gatewayAddress.octet4}/${formData.gatewayAddress.cidr}`;
  
    let dhcpData: Gateway['dhcp'] | undefined = undefined;
    if (formData.createDhcp) {
      dhcpData = {
        enabled: true,
        dhcpAddress: `${formData.dhcpAddress.octet1}.${formData.dhcpAddress.octet2}.${formData.dhcpAddress.octet3}.${formData.dhcpAddress.octet4}/${formData.dhcpAddress.cidr}`,
        rangeFrom: formData.rangeFrom,
        rangeTo: formData.rangeTo,
        dnsAddress: formData.dnsAddress,
        leaseTime: Number(formData.leaseTime),
      };
    }

    return {
      id: id || `gw-${Date.now()}`,
      name: formData.name,
      reservation: formData.reservation,
      subnet: subnet,
      description: formData.description,
      dhcp: dhcpData
    };
  }

  addGateway(formData: GatewayFormData): void {
    const newGateway = this.transformFormDataToGateway(formData);
    this.gatewaysState.update(gateways => [newGateway, ...gateways]);
  }

  updateGateway(id: string, formData: GatewayFormData): void {
    const updatedGateway = this.transformFormDataToGateway(formData, id);
    this.gatewaysState.update(gateways =>
      gateways.map(gw => (gw.id === id ? updatedGateway : gw))
    );
  }

  deleteGateway(id: string): void {
    this.gatewaysState.update(gateways => gateways.filter(gw => gw.id !== id));
  }
}