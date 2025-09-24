
export interface Service { 
  name: string; 
  icon: string; 
}

export interface FirewallRule {
  id: string;
  name: string;
  ruleId: string;
  sources: string;
  destinations: string;
  services: Service[];
  contextProfiles: string;
  appliedTo: string;
  action: 'Allow' | 'Deny' | 'Drop';
  enabled: boolean;
}

export interface FirewallPolicy {
  id: string;
  name: string;
  policyId: string;
  appliedTo: string;
  status: 'Success';
  rules: FirewallRule[];
  isExpanded: boolean;
}

// --- START: Data for View Members Modal ---
export interface Member {
    [key: string]: string | number;
}
export interface MemberCategory {
  id: 'vms' | 'ips' | 'nsx' | 'ports' | 'dist-port-groups' | 'dist-ports' | 'vifs';
  name: string;
  count: number;
  members: Member[];
  headers: string[];
}

export interface DefinitionCategory {
  id: 'criteria' | 'members' | 'ips' | 'macs' | 'ad';
  name: string;
  count: number;
  members: Member[];
  headers: string[];
}

export interface GroupData {
  id: string;
  name: string;
  groupType: 'Generic' | 'IPSet';
  memberCategories: MemberCategory[];
  definitionCategories?: DefinitionCategory[];
}

// --- START: Data for Edit Modals ---

export interface SelectableGroup {
    id: string;
    name: string;
    type: 'Generic' | 'IP Addresses Only';
    icon: string;
    description: string;
    tags: string[];
    memberCount: number;
}

// FIX: Added missing Draft interface
export interface Draft {
  id: string;
  name: string;
  lastModified: string;
}
