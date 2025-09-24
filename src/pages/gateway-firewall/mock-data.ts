
import { GatewayPolicy, GatewaySetting } from './types';

export const MOCK_GATEWAY_POLICIES: GatewayPolicy[] = [
    { id: 'gw-policy1', name: 'T1 Pre-Rules', policyId: '(1)', status: 'Success', rules: [
        { id: 'gw-rule1-1', name: 'Allow SSH to Jumpbox', ruleId: '101', sources: 'Admin-IP-Set', destinations: 'Jumpbox-VM', services: [{ name: 'SSH', icon: 'fas fa-terminal' }], profiles: 'None', appliedTo: 'Tier1-Gateway-01', action: 'Allow', enabled: true },
        { id: 'gw-rule1-2', name: 'Drop Invalid States', ruleId: '102', sources: 'Any', destinations: 'Any', services: [{ name: 'Any', icon: 'fas fa-asterisk' }], profiles: 'None', appliedTo: 'Tier1-Gateway-01', action: 'Drop', enabled: true },
    ], isExpanded: true },
    { id: 'gw-policy2', name: 'Default Tier1 Rules', policyId: '(3)', status: 'Success', rules: [
        { id: 'gw-rule2-1', name: 'Allow Web Inbound', ruleId: '103', sources: 'Any', destinations: 'Web-VIP', services: [{ name: 'HTTPS', icon: 'fas fa-lock' }], profiles: 'None', appliedTo: 'Tier1-Gateway-01', action: 'Allow', enabled: true },
        { id: 'gw-rule2-2', name: 'Allow App to DB Outbound', ruleId: '104', sources: 'App-Subnet', destinations: 'DB-Subnet-CIDR', services: [{ name: 'MySQL', icon: 'fas fa-database' }], profiles: 'None', appliedTo: 'Tier1-Gateway-01', action: 'Allow', enabled: true },
        { id: 'gw-rule2-3', name: 'Deny All Other Outbound', ruleId: '105', sources: 'Any', destinations: 'Any', services: [{ name: 'Any', icon: 'fas fa-asterisk' }], profiles: 'None', appliedTo: 'Tier1-Gateway-01', action: 'Reject', enabled: false },
    ], isExpanded: true },
    { id: 'gw-policy3', name: 'Emergency Block', policyId: '(0)', status: 'Success', rules: [], isExpanded: true },
];

export const MOCK_GATEWAY_SETTINGS: GatewaySetting[] = [
    { id: 'gw1', gatewayName: 'MCA>Como>org>cms basic plan', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw2', gatewayName: 'MCA>Como>org>ok', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw3', gatewayName: 'MCA>Como>org>reeeeeeeee...', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw4', gatewayName: 'MCA>Como>org>res', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw5', gatewayName: 'MCA>Como>org>res56', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw6', gatewayName: 'MCA>Como>org>tc', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw7', gatewayName: 'MCA>compepe>org1>ct', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw8', gatewayName: 'MCA>custeff>vvb>res', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw9', gatewayName: 'MCA>ggg>hhh>dfdf', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    { id: 'gw10', gatewayName: 'MCA>hjj>jk>bhjk', type: 'Tier1', gatewayFirewallEnabled: true, identityFirewallEnabled: false },
    ...Array.from({ length: 38 }, (_, i) => ({
        id: `gw${i + 11}`,
        gatewayName: `MCA>Como>org>generated-item-${i+1}`,
        type: 'Tier1',
        gatewayFirewallEnabled: true,
        identityFirewallEnabled: false
    }))
];
