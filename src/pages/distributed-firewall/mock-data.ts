
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
    { id: 'policy1', name: 'Web Servers Policy', policyId: '(2)', appliedTo: '2 Groups', status: 'Success', rules: [
        { id: 'rule-web-1', name: 'Allow HTTP', ruleId: '5', sources: 'Any', destinations: 'Web Servers Group', services: [{ name: 'HTTP', icon: 'fas fa-globe' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Allow', enabled: true },
        { id: 'rule-web-2', name: 'Allow HTTPS', ruleId: '6', sources: 'Any', destinations: 'Web Servers Group', services: [{ name: 'HTTPS', icon: 'fas fa-lock' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Allow', enabled: true },
    ], isExpanded: false },
    { id: 'policy2', name: 'Database Policy', policyId: '(1)', appliedTo: 'DB Servers Group', status: 'Success', rules: [
        { id: 'rule-db-1', name: 'Allow SQL', ruleId: '7', sources: 'App Servers Group', destinations: 'DB Servers Group', services: [{ name: 'MySQL', icon: 'fas fa-database' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Allow', enabled: true },
    ], isExpanded: false },
    { id: 'policy3', name: 'hello?!', policyId: '(1)', appliedTo: '1 Groups', status: 'Success', rules: [], isExpanded: false },
    { id: 'policy4', name: 'test', policyId: '(0)', appliedTo: 'DFW', status: 'Success', rules: [], isExpanded: false },
    {
        id: 'policy5', name: 'Default Layer3 Section', policyId: '(3)', appliedTo: 'DFW', status: 'Success', isExpanded: false,
        rules: [
            { id: 'rule1', name: 'Default Rule NDP', ruleId: '3', sources: 'Any', destinations: 'Any', services: [{ name: 'IPv6-ICMP Neigh...', icon: 'fas fa-cog' }, { name: 'IPv6-ICMP Neigh...', icon: 'fas fa-cog' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Allow', enabled: true },
            { id: 'rule2', name: 'Default Rule DHCP', ruleId: '4', sources: 'Any', destinations: 'Any', services: [{ name: 'DHCP-Server', icon: 'fas fa-cog' }, { name: 'DHCP-Client', icon: 'fas fa-cog' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Allow', enabled: true },
            { id: 'rule3', name: 'Default Layer3 Rule', ruleId: '2', sources: 'Any', destinations: 'Any', services: [{ name: 'Any', icon: '' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Allow', enabled: false },
        ]
    },
    { id: 'policy6', name: 'Management Access', policyId: '(2)', appliedTo: 'Mgmt Group', status: 'Success', isExpanded: false,
        rules: [
            { id: 'rule-mgmt-1', name: 'Allow SSH from Admin', ruleId: '8', sources: 'Admin IP Group', destinations: 'Mgmt Group', services: [{ name: 'SSH', icon: 'fas fa-terminal' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Allow', enabled: true },
            // FIX: The 'action' property was missing, and 'appliedTo' had the wrong value.
            { id: 'rule-mgmt-2', name: 'Deny All Other Mgmt', ruleId: '9', sources: 'Any', destinations: 'Mgmt Group', services: [{ name: 'Any', icon: '' }], contextProfiles: 'None', appliedTo: 'DFW', action: 'Deny', enabled: true },
        ]
    }
];
