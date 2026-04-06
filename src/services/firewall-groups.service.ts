import { Injectable, signal, computed } from '@angular/core';

export interface Member { [key: string]: string | number; }
export interface MemberCategory {
  id: string;
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
}

export interface FirewallGroup {
  id: string;
  name: string;
  reservation: string;
  description: string;
  tags: number;
  isSystemDefined?: boolean;
  isLocked?: boolean;
  status: 'Success' | 'Pending' | 'Error';
  members?: string[]; // IDs of selected members
  ipAddresses?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FirewallGroupsService {
  private groups = signal<FirewallGroup[]>([
    { id: 'group1', name: 'DefaultMaliciousIpGroup', reservation: 'maliroaya', description: 'Default Malicious IP group', tags: 0, isSystemDefined: true, status: 'Success', members: [] },
    { id: 'group2', name: 'Edge_NSGroup', reservation: 'maliroaya', description: 'NSX group for edge nodes', tags: 0, isLocked: true, status: 'Success', members: [] },
    { id: 'group3', name: 'f31e1b66-29e3-4ff2-a5bc-5233fd1a891a', reservation: 'maliroaya', description: 'Auto-generated application group', tags: 2, status: 'Success', members: [] },
    { id: 'group4', name: 'group from code', reservation: 'maliroaya', description: 'Group managed via infrastructure-as-code', tags: 1, isSystemDefined: true, status: 'Pending', members: [] },
    { id: 'group5', name: 'MCA>Como>org>wdqwd', reservation: 'maliroaya', description: 'Group for Como org', tags: 0, status: 'Success', members: [] },
    { id: 'group6', name: 'MCA>rotest>org>bb', reservation: 'maliroaya', description: 'Test group for BB', tags: 0, status: 'Error', members: [] },
    { id: 'group7', name: 'MCA>protest>org>n', reservation: 'maliroaya', description: 'Test group for N', tags: 0, status: 'Success', members: [] },
    { id: 'group8', name: 'MCA>protest>org>rkjrjg', reservation: 'maliroaya', description: 'Test group for RKJRJG', tags: 0, status: 'Success', members: [] },
    { id: 'group9', name: 'MCA>sso11>sso11>Ahmed Mohamed Ra...', reservation: 'maliroaya', description: 'SSO group for Ahmed Mohamed', tags: 0, status: 'Pending', members: [] },
    { id: 'group10', name: 'MCA>sso11>sso11>sa', reservation: 'maliroaya', description: 'SSO group for SA', tags: 0, status: 'Success', members: [] },
    { id: 'group11', name: 'MCA>sso8>sso8>Ahmed Mohamed R', reservation: 'maliroaya', description: 'SSO group for Ahmed Mohamed R', tags: 0, status: 'Success', members: [] },
  ]);

  getGroups() {
    return this.groups.asReadonly();
  }

  getGroupById(id: string) {
    return this.groups().find(g => g.id === id);
  }

  addGroup(group: Omit<FirewallGroup, 'id' | 'status' | 'tags'>) {
    const newGroup: FirewallGroup = {
      ...group,
      id: `group-${Date.now()}`,
      status: 'Success',
      tags: 0
    };
    this.groups.update(gs => [newGroup, ...gs]);
  }

  updateGroup(id: string, updates: Partial<FirewallGroup>) {
    this.groups.update(gs => gs.map(g => g.id === id ? { ...g, ...updates } : g));
  }

  deleteGroup(id: string) {
    this.groups.update(gs => gs.filter(g => g.id !== id));
  }
}
