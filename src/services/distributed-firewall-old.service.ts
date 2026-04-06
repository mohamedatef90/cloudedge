import { Injectable, signal } from '@angular/core';
import { FirewallPolicy, FirewallRule } from '../pages/distributed-firewall/types';
import { mockPoliciesData } from '../pages/distributed-firewall/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DistributedFirewallOldService {
  private _policies = signal<FirewallPolicy[]>(mockPoliciesData.map(p => ({ ...p, isExpanded: false })));
  policies = this._policies.asReadonly();

  getPolicyById(id: string): FirewallPolicy | undefined {
    return this._policies().find(p => p.id === id);
  }

  addPolicy(policy: FirewallPolicy) {
    this._policies.update(ps => [...ps, policy]);
  }

  updatePolicy(id: string, updatedPolicy: Partial<FirewallPolicy>) {
    this._policies.update(ps => ps.map(p => p.id === id ? { ...p, ...updatedPolicy } : p));
  }

  deletePolicy(id: string) {
    this._policies.update(ps => ps.filter(p => p.id !== id));
  }

  updateRule(policyId: string, ruleId: string, updatedRule: Partial<FirewallRule>) {
    this._policies.update(ps => ps.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          rules: p.rules.map(r => r.id === ruleId ? { ...r, ...updatedRule } : r)
        };
      }
      return p;
    }));
  }

  addRule(policyId: string, rule: FirewallRule) {
    this._policies.update(ps => ps.map(p => {
      if (p.id === policyId) {
        return { ...p, rules: [...p.rules, rule] };
      }
      return p;
    }));
  }

  removeRule(policyId: string, ruleId: string) {
    this._policies.update(ps => ps.map(p => {
      if (p.id === policyId) {
        return { ...p, rules: p.rules.filter(r => r.id !== ruleId) };
      }
      return p;
    }));
  }
}
