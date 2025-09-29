export interface StatCard {
  title: string;
  icon: string;
  value: number;
  total: number;
  unit: string;
  percentage: number;
  label: string;
  uptime?: string;
  historicalData?: { time: Date; value: number }[];
}

export interface VirtualMachine {
  id: string;
  name: string;
  os: 'windows' | 'ubuntu' | 'linux';
  status: 'running' | 'stopped' | 'suspended';
  cpu: {
    usage: number; // percentage
  };
  memory: {
    usage: number; // percentage
  };
  storage: {
    usage: number; // percentage
  };
}

export interface AuditTrailEntry {
  id: string;
  eventName: string;
  eventSource: 'Compute' | 'Security' | 'Network' | 'Identity';
  eventTime: string;
  user: string;
  resourceName: string;
  ipAddress: string;
  status: 'Success' | 'Failure';
}

export interface QuickStartLink {
  title: string;
  description: string;
  icon: string;
  path: string;
}

export interface HelpfulResource {
  title: string;
  description: string;
  icon: string;
  path: string;
}

// FIX: Added missing BillingData type definition.
export interface BillingData {
  currentMonthCost: number;
  projectedCost: number;
  breakdown: { service: string; cost: number; color: string }[];
}
