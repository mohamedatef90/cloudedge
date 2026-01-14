
export type AddonName =
  | 'Windows Enterprise Licenses'
  | 'Linux Enterprise Licenses'
  | 'Cortex XDR Endpoint Protection / VM'
  | 'Public IPs'
  | 'Load Balancer/ IP'
  | 'Advanced Backup by Veeam'
  | 'Trend Micro Deep Security/ VM';

export interface PlanAddon {
  name: AddonName;
  included: boolean;
  quantity?: number;
}

export type FixedPlanName = 'General Purpose' | 'Compute Optimized' | 'Memory Optimized';

export interface Plan {
  id: string;
  name: FixedPlanName | 'Custom';
  type: 'Fixed' | 'Custom';
  cores: number;
  ram: number; // in GB
  storage: number; // in GB
  storageType?: string;
  addons: PlanAddon[];
  price?: number; // Monthly price for fixed plans
  featureList?: string[];
  supportList?: string[];
}

export interface Reservation {
  id: string;
  name: string;
  plan: Plan;
  status: 'Active' | 'Expired' | 'Pending';
  startDate: string;
  endDate: string;
}

export const ALL_ADDONS: AddonName[] = [
  'Windows Enterprise Licenses',
  'Linux Enterprise Licenses',
  'Cortex XDR Endpoint Protection / VM',
  'Public IPs',
  'Load Balancer/ IP',
  'Advanced Backup by Veeam',
  'Trend Micro Deep Security/ VM',
];

export const FIXED_PLANS: Plan[] = [
  {
    id: 'plan-general-purpose',
    name: 'General Purpose',
    type: 'Fixed',
    cores: 6,
    ram: 32,
    storage: 150,
    storageType: 'Flash NVME',
    price: 224,
    addons: ALL_ADDONS.map(name => ({
      name,
      included: name === 'Cortex XDR Endpoint Protection / VM',
      quantity: undefined,
    })),
    featureList: [
        '32 GB RAM',
        '6 vCPU Cores',
        '150 GB Flash NVME',
        'Next Generation Firewall as service',
        'Cortex XDR Antivirus (By PaloAlto)',
        '1 GB Internet',
        '6 TB Traffic',
        '99.9% Availability'
    ],
    supportList: [
        'Free support',
        'Free firewall',
        'Ransomware recovery 3 days'
    ]
  },
  {
    id: 'plan-compute-optimized',
    name: 'Compute Optimized',
    type: 'Fixed',
    cores: 12,
    ram: 24,
    storage: 200,
    storageType: 'Flash NVME',
    price: 280,
    addons: ALL_ADDONS.map(name => ({
      name,
      included: ['Cortex XDR Endpoint Protection / VM', 'Public IPs'].includes(name),
      quantity: name === 'Public IPs' ? 1 : undefined,
    })),
    featureList: [
      '24 GB RAM',
      '12 vCPU Cores',
      '200 GB Flash NVME',
      'Optimized for CPU-intensive tasks',
      'Cortex XDR Antivirus (By PaloAlto)',
      '1 GB Internet',
      '8 TB Traffic',
      '99.9% Availability'
    ],
    supportList: [
      'Free support',
      'Free firewall',
      'Ransomware recovery 3 days'
    ]
  },
  {
    id: 'plan-memory-optimized',
    name: 'Memory Optimized',
    type: 'Fixed',
    cores: 20,
    ram: 128,
    storage: 1024,
    storageType: 'Flash NVME',
    price: 768,
    addons: ALL_ADDONS.map(name => ({
      name,
      included: name === 'Cortex XDR Endpoint Protection / VM',
      quantity: undefined,
    })),
    featureList: [
        '128 GB RAM',
        '20 vCPU Cores',
        '1 TB Flash NVME',
        'Next Generation Firewall as service',
        'Cortex XDR Antivirus (By PaloAlto)',
        'Ransomware Protection',
        '1 GB Internet',
        '12 TB Traffic',
        '99.9% Availability'
    ],
    supportList: [
        'Free support',
        'Free firewall',
        'Ransomware recovery 3 days'
    ]
  }
];

export const MOCK_INITIAL_RESERVATIONS: Reservation[] = [
    {
      id: 'res-1',
      name: 'Web-Tier-Reservation',
      plan: FIXED_PLANS[0], // General Purpose
      status: 'Active',
      startDate: '2023-01-20T00:00:00Z',
      endDate: '2025-01-20T00:00:00Z',
    },
    {
      id: 'res-2',
      name: 'DB-Tier-Reservation',
      plan: FIXED_PLANS[2], // Memory Optimized
      status: 'Active',
      startDate: '2023-08-01T00:00:00Z',
      endDate: '2024-08-01T00:00:00Z',
    },
    {
      id: 'res-3',
      name: 'Dev-VM-Reservation-Old',
      plan: FIXED_PLANS[0], // General Purpose
      status: 'Expired',
      startDate: '2022-11-15T00:00:00Z',
      endDate: '2023-11-15T00:00:00Z',
    },
    {
      id: 'res-4',
      name: 'Compute-Cluster-Reservation',
      plan: FIXED_PLANS[1], // Compute Optimized
      status: 'Active',
      startDate: '2024-02-10T00:00:00Z',
      endDate: '2025-02-10T00:00:00Z',
    },
    {
      id: 'res-5',
      name: 'Future-Project-Titan',
      plan: {
        id: 'plan-custom-1',
        name: 'Custom',
        type: 'Custom',
        cores: 16,
        ram: 64,
        storage: 1024,
        addons: ALL_ADDONS.map(name => ({ name, included: true, quantity: name === 'Public IPs' ? 5 : undefined }))
      },
      status: 'Pending',
      startDate: '2024-09-01T00:00:00Z',
      endDate: '2025-09-01T00:00:00Z',
    },
  ];