
import { Injectable, signal } from '@angular/core';
import { StaticRouteFirewallRule } from './routes.types';

const MOCK_FIREWALL_RULES: StaticRouteFirewallRule[] = [
    { id: 'fw-1', name: 'Allow-All-Outbound', sources: 'Any', destinations: 'Any', services: 'Any', action: 'Allow', enabled: true },
    { id: 'fw-2', name: 'Block-Internal-to-DMZ', sources: 'Internal-Network', destinations: 'DMZ-Network', services: 'Any', action: 'Drop', enabled: true },
    { id: 'fw-3', name: 'Allow-Web-Traffic', sources: 'Any', destinations: 'Web-Servers', services: 'HTTP, HTTPS', action: 'Allow', enabled: false },
];

@Injectable({ providedIn: 'root' })
export class RouteFirewallService {
  private firewallRulesState = signal<StaticRouteFirewallRule[]>(MOCK_FIREWALL_RULES);
  firewallRules = this.firewallRulesState.asReadonly();

  addRule(rule: Omit<StaticRouteFirewallRule, 'id'>) {
      const newRule: StaticRouteFirewallRule = {
          id: `fw-${Date.now()}`,
          ...rule,
      };
      this.firewallRulesState.update(rules => [newRule, ...rules]);
  }
  
  updateRule(updatedRule: StaticRouteFirewallRule) {
      this.firewallRulesState.update(rules => 
          rules.map(r => r.id === updatedRule.id ? updatedRule : r)
      );
  }

  deleteRules(ids: string[]) {
      this.firewallRulesState.update(rules => rules.filter(r => !ids.includes(r.id)));
  }
}
