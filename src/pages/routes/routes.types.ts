
export interface StaticRouteFirewallRule {
  id: string;
  name: string;
  sources: string;
  destinations: string;
  services: string;
  action: 'Allow' | 'Drop';
  enabled: boolean;
}

export interface StaticRoute {
  id: string;
  name: string;
  destination: string; // e.g., '0.0.0.0/0'
  nextHop: string; // e.g., '192.168.1.1'
  firewallRuleId: string | null; // ID of a StaticRouteFirewallRule
  enabled: boolean;
}
