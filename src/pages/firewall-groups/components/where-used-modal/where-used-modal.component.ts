import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { FirewallGroup } from '../../firewall-groups.component';

interface WhereUsedReference {
    id: string;
    serviceEntity: string;
    location: {
        path: string[];
        target: string;
    };
}

@Component({
  selector: 'app-where-used-modal',
  templateUrl: './where-used-modal.component.html',
  styleUrls: ['./where-used-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class WhereUsedModalComponent {
  isOpen = input.required<boolean>();
  group = input<FirewallGroup | null>();
  close = output<void>();

  searchTerm = signal('');

  mockReferences: WhereUsedReference[] = [
      {
          id: 'ref1',
          serviceEntity: 'Distributed Firewall',
          location: {
              path: ['Infrastructure', 'Default Malicious IP Block Rules', 'Malicious IP at Source Rule'],
              target: 'Source'
          }
      },
      {
          id: 'ref2',
          serviceEntity: 'Distributed Firewall',
          location: {
              path: ['Infrastructure', 'Default Malicious IP Block Rules', 'Malicious IP at Destination Rule'],
              target: 'Destination'
          }
      }
  ];

  references = computed(() => {
    return this.group()?.name === 'DefaultMaliciousIpGroup' ? this.mockReferences : [];
  });

  filteredReferences = computed(() => {
    const refs = this.references();
    const term = this.searchTerm().toLowerCase();
    if (!term) return refs;
    
    return refs.filter(ref => 
        ref.serviceEntity.toLowerCase().includes(term) ||
        ref.location.path.join(' ').toLowerCase().includes(term) ||
        ref.location.target.toLowerCase().includes(term)
    );
  });
  
  onClose(): void {
    this.close.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}