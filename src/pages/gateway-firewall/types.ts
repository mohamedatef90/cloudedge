
export interface GatewayRule {
  id: string;
  name: string;
  ruleId: string;
  sources: string;
  destinations: string;
  services: { name: string; icon: string }[];
  profiles: string;
  appliedTo: string;
  action: 'Allow' | 'Drop' | 'Reject';
  enabled: boolean;
}

export interface GatewayPolicy {
  id: string;
  name: string;
  policyId: string;
  rules: GatewayRule[];
  isExpanded: boolean;
  status: 'Success';
}

export interface GatewaySetting {
  id: string;
  gatewayName: string;
  type: string;
  gatewayFirewallEnabled: boolean;
  identityFirewallEnabled: boolean;
}
