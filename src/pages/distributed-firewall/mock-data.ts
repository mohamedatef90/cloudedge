import { FirewallPolicy, GroupData, SelectableGroup, Service } from './types';

export const mockGroupData: { [key: string]: GroupData } = {
  'Web Servers Group': {
    id: 'f31e1b66-29e3-4ff2-a5bc-5233fd1a891a',
    name: 'Web Servers Group',
    groupType: 'Generic',
    memberCategories: [
      { id: 'vms', name: 'Virtual Machines', count: 0, members: [], headers: ['Name', 'Status'] },
      { id: 'ips', name: 'IP Addresses', count: 2, members: [{ 'IP Addresses': '192.168.100.2' }, { 'IP Addresses': '1.0.0.0' }], headers: ['IP Addresses'] },
      { id: 'nsx', name: 'NSX Segments', count: 1, members: [{ Name: 'web-segment' }], headers: ['Name'] },
      { id: 'ports', name: 'Segment Ports', count: 2, members: [{ Name: 'port-1' }, { Name: 'port-2' }], headers: ['Name'] },
      { id: 'dist-port-groups', name: 'Distributed Port Groups', count: 0, members: [], headers: ['Name'] },
      { id: 'dist-ports', name: 'Distributed Ports', count: 0, members: [], headers: ['Name'] },
      { id: 'vifs', name: 'VIFs', count: 0, members: [], headers: ['Name'] },
    ],
    definitionCategories: [
      { id: 'criteria', name: 'Membership Criteria', count: 1, members: [{ Criteria: 'VM Tag equals "web"' }], headers: ['Criteria'] },
      { id: 'members', name: 'Members', count: 0, members: [], headers: ['Name', 'Type'] },
      { id: 'ips', name: 'IP Addresses', count: 2, members: [{ 'IP Address': '192.168.100.2' }, { 'IP Address': '1.0.0.0' }], headers: ['IP Address'] },
      { id: 'macs', name: 'MAC Addresses', count: 0, members: [], headers: ['MAC Address'] },
      { id: 'ad', name: 'AD Groups', count: 0, members: [], headers: ['Group Name'] }
    ]
  },
  'DB Servers Group': {
      id: 'a1b2c3d4-e5f6-7890-ghij-klmnopqrstuv',
      name: 'DB Servers Group',
      groupType: 'Generic',
      memberCategories: [
          { id: 'vms', name: 'Virtual Machines', count: 1, members: [{ Name: 'db-vm-01', Status: 'Running' }], headers: ['Name', 'Status'] },
          { id: 'ips', name: 'IP Addresses', count: 1, members: [{ 'IP Addresses': '10.10.10.5' }], headers: ['IP Addresses'] },
          { id: 'nsx', name: 'NSX Segments', count: 1, members: [{ Name: 'db-segment' }], headers: ['Name'] },
          { id: 'ports', name: 'Segment Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-port-groups', name: 'Distributed Port Groups', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-ports', name: 'Distributed Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'vifs', name: 'VIFs', count: 0, members: [], headers: ['Name'] },
      ],
      definitionCategories: [
        { id: 'criteria', name: 'Membership Criteria', count: 1, members: [{ Criteria: 'VM Name contains "db"' }], headers: ['Criteria'] },
        { id: 'members', name: 'Members', count: 1, members: [{ Name: 'db-vm-01', Type: 'Virtual Machine' }], headers: ['Name', 'Type'] },
        { id: 'ips', name: 'IP Addresses', count: 1, members: [{ 'IP Address': '10.10.10.5' }], headers: ['IP Address'] },
        { id: 'macs', name: 'MAC Addresses', count: 0, members: [], headers: ['MAC Address'] },
        { id: 'ad', name: 'AD Groups', count: 0, members: [], headers: ['Group Name'] }
    ]
  },
  'App Servers Group': {
      id: 'z9y8x7w6-v5u4-3210-fedc-ba9876543210',
      name: 'App Servers Group',
      groupType: 'Generic',
      memberCategories: [
          { id: 'vms', name: 'Virtual Machines', count: 2, members: [{ Name: 'app-vm-01', Status: 'Running' }, { Name: 'app-vm-02', Status: 'Running' }], headers: ['Name', 'Status'] },
          { id: 'ips', name: 'IP Addresses', count: 0, members: [], headers: ['IP Addresses'] },
          { id: 'nsx', name: 'NSX Segments', count: 0, members: [], headers: ['Name'] },
          { id: 'ports', name: 'Segment Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-port-groups', name: 'Distributed Port Groups', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-ports', name: 'Distributed Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'vifs', name: 'VIFs', count: 0, members: [], headers: ['Name'] },
      ],
      definitionCategories: [
        { id: 'criteria', name: 'Membership Criteria', count: 0, members: [], headers: ['Criteria'] },
        { id: 'members', name: 'Members', count: 2, members: [{ Name: 'app-vm-01', Type: 'Virtual Machine' }, { Name: 'app-vm-02', Type: 'Virtual Machine' }], headers: ['Name', 'Type'] },
        { id: 'ips', name: 'IP Addresses', count: 0, members: [], headers: ['IP Address'] },
        { id: 'macs', name: 'MAC Addresses', count: 0, members: [], headers: ['MAC Address'] },
        { id: 'ad', name: 'AD Groups', count: 0, members: [], headers: ['Group Name'] }
    ]
  },
   'Admin IP Group': {
      id: 'admin-ip-group-id',
      name: 'Admin IP Group',
      groupType: 'IPSet',
      memberCategories: [
          { id: 'vms', name: 'Virtual Machines', count: 0, members: [], headers: ['Name', 'Status'] },
          { id: 'ips', name: 'IP Addresses', count: 1, members: [{ 'IP Addresses': '73.125.88.10' }], headers: ['IP Addresses'] },
          { id: 'nsx', name: 'NSX Segments', count: 0, members: [], headers: ['Name'] },
          { id: 'ports', name: 'Segment Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-port-groups', name: 'Distributed Port Groups', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-ports', name: 'Distributed Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'vifs', name: 'VIFs', count: 0, members: [], headers: ['Name'] },
      ],
      definitionCategories: [
        { id: 'criteria', name: 'Membership Criteria', count: 0, members: [], headers: ['Criteria'] },
        { id: 'members', name: 'Members', count: 0, members: [], headers: ['Name', 'Type'] },
        { id: 'ips', name: 'IP Addresses', count: 1, members: [{ 'IP Address': '73.125.88.10' }], headers: ['IP Address'] },
        { id: 'macs', name: 'MAC Addresses', count: 0, members: [], headers: ['MAC Address'] },
        { id: 'ad', name: 'AD Groups', count: 0, members: [], headers: ['Group Name'] }
    ]
  },
   'Mgmt Group': {
      id: 'mgmt-group-id',
      name: 'Mgmt Group',
      groupType: 'Generic',
      memberCategories: [
          { id: 'vms', name: 'Virtual Machines', count: 3, members: [{ Name: 'mgmt-vm-01', Status: 'Running' }, { Name: 'mgmt-vm-02', Status: 'Running' }, { Name: 'mgmt-vm-03', Status: 'Stopped' }], headers: ['Name', 'Status'] },
          { id: 'ips', name: 'IP Addresses', count: 0, members: [], headers: ['IP Addresses'] },
          { id: 'nsx', name: 'NSX Segments', count: 0, members: [], headers: ['Name'] },
          { id: 'ports', name: 'Segment Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-port-groups', name: 'Distributed Port Groups', count: 0, members: [], headers: ['Name'] },
          { id: 'dist-ports', name: 'Distributed Ports', count: 0, members: [], headers: ['Name'] },
          { id: 'vifs', name: 'VIFs', count: 0, members: [], headers: ['Name'] },
      ],
      definitionCategories: [
        { id: 'criteria', name: 'Membership Criteria', count: 1, members: [{ Criteria: 'VM Name starts with "mgmt-"' }], headers: ['Criteria'] },
        { id: 'members', name: 'Members', count: 0, members: [], headers: ['Name', 'Type'] },
        { id: 'ips', name: 'IP Addresses', count: 0, members: [], headers: ['IP Address'] },
        { id: 'macs', name: 'MAC Addresses', count: 0, members: [], headers: ['MAC Address'] },
        { id: 'ad', name: 'AD Groups', count: 0, members: [], headers: ['Group Name'] }
    ]
  }
};

export const mockAvailableServices: Service[] = [
    { name: 'HTTP', icon: 'fas fa-globe' },
    { name: 'HTTPS', icon: 'fas fa-lock' },
    { name: 'SSH', icon: 'fas fa-terminal' },
    { name: 'MySQL', icon: 'fas fa-database' },
    { name: 'DHCP-Server', icon: 'fas fa-cog' },
    { name: 'DHCP-Client', icon: 'fas fa-cog' },
    { name: 'IPv6-ICMP Neigh...', icon: 'fas fa-cog' },
    { name: 'Any', icon: 'fas fa-asterisk' },
];

export const mockAvailableGroupsForSelection: SelectableGroup[] = [
    { id: 'group1', name: 'DefaultMaliciousIpGroup', type: 'IP Addresses Only', icon: 'fas fa-globe-americas', description: 'A list of known malicious IP addresses, updated regularly by the system.', tags: ['security', 'blacklist', 'system'], memberCount: 14082 },
    { id: 'group2', name: 'Edge_NSGroup', type: 'Generic', icon: 'fas fa-lock', description: 'Default NSX group for edge transport nodes.', tags: ['nsx', 'edge', 'infrastructure'], memberCount: 4 },
    { id: 'group3', name: 'f31e1b66-29e3-4ff2-a5bc-5233fd1a891a', type: 'Generic', icon: 'fas fa-cubes', description: 'Auto-generated group for specific application tier.', tags: ['auto-generated'], memberCount: 8 },
    { id: 'group7', name: 'Web Servers Group', type: 'Generic', icon: 'fas fa-cubes', description: 'Contains all virtual machines tagged as "web". Used for applying web traffic rules.', tags: ['web', 'frontend', 'app-tier'], memberCount: 5 },
    { id: 'group8', name: 'DB Servers Group', type: 'Generic', icon: 'fas fa-cubes', description: 'Contains all virtual machines tagged as "database". Used for restricting access to data.', tags: ['database', 'backend', 'data-tier', 'critical'], memberCount: 3 },
    { id: 'group9', name: 'App Servers Group', type: 'Generic', icon: 'fas fa-cubes', description: 'Business logic application servers.', tags: ['app-tier', 'business-logic'], memberCount: 12 },
    { id: 'group10', name: 'Admin IP Group', type: 'IP Addresses Only', icon: 'fas fa-globe-americas', description: 'A static set of IP addresses for administrative access.', tags: ['admin', 'management', 'security'], memberCount: 2 },
    { id: 'group11', name: 'Mgmt Group', type: 'Generic', icon: 'fas fa-cubes', description: 'Group containing all management and infrastructure virtual machines.', tags: ['management', 'infrastructure'], memberCount: 3 },
    { id: 'group12', name: 'Any', type: 'Generic', icon: 'fas fa-asterisk', description: 'Represents any source or destination. Use with caution.', tags: ['any', 'unrestricted'], memberCount: 0 },
];

export const mockPoliciesData: FirewallPolicy[] = [
    { 
        id: 'policy1', name: 'asfsfdsgdfg', policyId: '(1)', appliedTo: 'DFW', status: 'Success', rules: [
            { id: 'rule-web-1', name: 'asfsfdsgdfg', ruleId: '1', sources: 'g1, as, em, v1, yyyyyyyyy, 1.1.1.1, new-source-1, new-source-2, another-long-source-name-for-testing', destinations: 'g1', services: [{ name: 'Any', icon: 'fas fa-asterisk' }], contextProfiles: 'name2', appliedTo: 'v1', action: 'Allow', enabled: true, status: 'Success' },
        ], isExpanded: true 
    },
    { 
        id: 'policy2', name: 'hj', policyId: '(1)', appliedTo: 'DFW', status: 'Success', rules: [
            { id: 'rule-db-1', name: '639ddb61-3af1-4ead-b605-adc4d54e633', ruleId: '2', sources: 'g1, as, em, v1, yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy..., 1.1.1.1', destinations: 'mk', services: [{ name: 'Any', icon: 'fas fa-asterisk' }], contextProfiles: 'xzzx', appliedTo: 'v1', action: 'Reject', enabled: true, status: 'Error' },
        ], isExpanded: true 
    },
    { 
        id: 'policy3', name: 'Deny-Ping', policyId: '(1)', appliedTo: 'DFW', status: 'Success', rules: [
            { id: 'rule-ping-1', name: 'Deny-Ping', ruleId: '3', sources: 'Tamer-test-group1, Tamer-test-group2', destinations: 'Tamer-test-group2, Tamer-test-group1', services: [{ name: 'SSH', icon: 'fas fa-terminal' }], contextProfiles: 'None', appliedTo: 'Tamer-test-group1, Tamer-test-group2', action: 'Reject', enabled: true, status: 'Success' },
        ], isExpanded: true 
    },
];