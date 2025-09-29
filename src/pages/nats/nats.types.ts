export interface NatRule {
  id: string;
  name: string;
  reservation: string | null;
  actionType: 'SNAT' | 'DNAT' | 'NO SNAT' | 'NO DNAT' | 'REFLEXIVE';
  source: string;
  destination: string;
  translated: string;
  service: string;
  description: string;
  status: 'Enabled' | 'Disabled';
}
