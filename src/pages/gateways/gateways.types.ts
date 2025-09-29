
export interface Gateway {
  id: string;
  name: string;
  reservation: string | null;
  subnet: string;
  description: string;
  dhcp?: {
    enabled: boolean;
    dhcpAddress: string;
    rangeFrom: string;
    rangeTo: string;
    dnsAddress: string;
    leaseTime: number;
  };
}

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
