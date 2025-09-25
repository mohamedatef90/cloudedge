
export interface VirtualMachine {
  id: string;
  name: string;
  description?: string;
  os: 'windows' | 'ubuntu' | 'linux';
  cores: number;
  memory: number; // in GB
  storage: number; // in GB
  nicCount: number;
  ipAddress: string;
  reservationName: string | null;
  creationDate: string;
  status: 'running' | 'stopped' | 'suspended';
}

export const VIRTUAL_MACHINES_DATA: VirtualMachine[] = [
    {
      id: 'vm-01',
      name: 'prod-web-server-01',
      description: 'Main production web server hosting the company website and customer-facing API.',
      os: 'ubuntu',
      cores: 4,
      memory: 8,
      storage: 100,
      nicCount: 2,
      ipAddress: '192.168.1.10',
      reservationName: 'Web-Tier-Reservation',
      creationDate: '2023-05-10',
      status: 'running',
    },
    {
      id: 'vm-02',
      name: 'sql-database-main',
      description: 'Primary SQL database server for all production applications. High availability enabled.',
      os: 'windows',
      cores: 8,
      memory: 32,
      storage: 500,
      nicCount: 1,
      ipAddress: '192.168.1.15',
      reservationName: 'DB-Tier-Reservation',
      creationDate: '2023-03-22',
      status: 'running',
    },
    {
      id: 'vm-03',
      name: 'dev-environment-centos',
      description: 'General purpose development and testing environment for the engineering team.',
      os: 'linux',
      cores: 2,
      memory: 4,
      storage: 50,
      nicCount: 1,
      ipAddress: '10.0.0.5',
      reservationName: null,
      creationDate: '2023-08-01',
      status: 'stopped',
    },
    {
      id: 'vm-04',
      name: 'k8s-worker-node-a',
      description: 'Kubernetes worker node for the containerized application cluster.',
      os: 'ubuntu',
      cores: 16,
      memory: 64,
      storage: 200,
      nicCount: 4,
      ipAddress: '192.168.2.21',
      reservationName: 'Compute-Cluster-Reservation',
      creationDate: '2023-09-15',
      status: 'running',
    },
    {
      id: 'vm-05',
      name: 'AD-Domain-Controller',
      description: 'Active Directory domain controller for user authentication and authorization.',
      os: 'windows',
      cores: 4,
      memory: 16,
      storage: 150,
      nicCount: 1,
      ipAddress: '172.16.0.10',
      reservationName: null,
      creationDate: '2022-11-30',
      status: 'suspended',
    },
];
