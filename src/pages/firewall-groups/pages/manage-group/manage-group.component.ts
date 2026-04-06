import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IconComponent } from '../../../../components/icon/icon.component';
import { FirewallGroupsService } from '../../../../services/firewall-groups.service';

interface MemberItem {
  id: string;
  name: string;
  type: 'VM' | 'Gateway';
  isSelected?: boolean;
}

@Component({
  selector: 'app-manage-group',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './manage-group.component.html',
  styleUrls: ['./manage-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGroupComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private firewallGroupsService = inject(FirewallGroupsService);

  activeTab = signal<'main' | 'members' | 'ips'>('main');
  isEditMode = signal(false);
  groupId = signal<string | null>(null);
  
  groupForm = signal({
    name: '',
    reservations: 'maliroaya',
    description: '',
    ipAddresses: ''
  });

  // Members Tab State
  memberFilter = signal<string>('All');
  allMembers = signal<MemberItem[]>([
    { id: '1', name: 'development-backup', type: 'VM' },
    { id: '2', name: 'Docker-VM', type: 'VM' },
    { id: '3', name: 'Kubernetes Test', type: 'Gateway' },
    { id: '4', name: 'maliroaya-segment1', type: 'Gateway' },
    { id: '5', name: 'GP_maliroaya', type: 'Gateway' },
    { id: '6', name: 'node-testN4', type: 'VM' },
    { id: '7', name: 'node-testN2', type: 'VM' },
  ]);

  filteredMembers = computed(() => {
    const filter = this.memberFilter();
    if (filter === 'All') return this.allMembers();
    return this.allMembers().filter(m => m.type === filter);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.groupId.set(id);
      const group = this.firewallGroupsService.getGroupById(id);
      if (group) {
        this.groupForm.set({
          name: group.name,
          reservations: group.reservation,
          description: group.description,
          ipAddresses: group.ipAddresses?.join(', ') || ''
        });
        
        // Restore member selection if we had it stored
        if (group.members) {
          this.allMembers.update(members => 
            members.map(m => ({
              ...m,
              isSelected: group.members?.includes(m.id) || false
            }))
          );
        }
      }
    }
  }

  setActiveTab(tab: 'main' | 'members' | 'ips') {
    this.activeTab.set(tab);
  }

  toggleMemberSelection(memberId: string) {
    this.allMembers.update(members => 
      members.map(m => m.id === memberId ? { ...m, isSelected: !m.isSelected } : m)
    );
  }

  handleSave() {
    const form = this.groupForm();
    const selectedMemberIds = this.allMembers()
      .filter(m => m.isSelected)
      .map(m => m.id);

    const groupData = {
      name: form.name,
      reservation: form.reservations,
      description: form.description,
      members: selectedMemberIds,
      ipAddresses: form.ipAddresses.split(/[,\n]/).map(ip => ip.trim()).filter(ip => ip !== '')
    };

    if (this.isEditMode() && this.groupId()) {
      this.firewallGroupsService.updateGroup(this.groupId()!, groupData);
    } else {
      this.firewallGroupsService.addGroup(groupData);
    }

    this.router.navigate(['/app/cloud-edge/inventory/firewall-groups']);
  }

  handleCancel() {
    this.router.navigate(['/app/cloud-edge/inventory/firewall-groups']);
  }
}
