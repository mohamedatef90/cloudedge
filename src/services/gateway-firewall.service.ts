
import { Injectable, signal } from '@angular/core';
import { GatewayPolicy, GatewayRule } from '../pages/gateway-firewall/types';
import { MOCK_GATEWAY_POLICIES } from '../pages/gateway-firewall/mock-data';

@Injectable({
  providedIn: 'root'
})
export class GatewayFirewallService {
  private _policies = signal<GatewayPolicy[]>(MOCK_GATEWAY_POLICIES);
  policies = this._policies.asReadonly();

  getPolicyById(id: string) {
    return this._policies().find(p => p.id === id);
  }

  addPolicy(policy: GatewayPolicy) {
    this._policies.update(prev => [policy, ...prev]);
  }

  updatePolicy(id: string, updates: Partial<GatewayPolicy>) {
    this._policies.update(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }

  deletePolicy(id: string) {
    this._policies.update(prev => prev.filter(p => p.id !== id));
  }

  updateRule(policyId: string, ruleId: string, updates: Partial<GatewayRule>) {
    this._policies.update(prev => prev.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          rules: p.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r)
        };
      }
      return p;
    }));
  }

  removeRule(policyId: string, ruleId: string) {
    this._policies.update(prev => prev.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          rules: p.rules.filter(r => r.id !== ruleId)
        };
      }
      return p;
    }));
  }
}
