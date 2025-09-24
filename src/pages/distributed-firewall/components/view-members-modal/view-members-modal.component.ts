import { ChangeDetectionStrategy, Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import { GroupData, MemberCategory, DefinitionCategory } from '../../types';

@Component({
  selector: 'app-view-members-modal',
  templateUrl: './view-members-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class ViewMembersModalComponent {
  isOpen = input.required<boolean>();
  groupData = input<GroupData | null>();
  close = output<void>();

  activeMainTab = signal<'effective' | 'definition'>('effective');
  activeCategory = signal<MemberCategory | null>(null);
  activeDefinitionCategory = signal<DefinitionCategory | null>(null);

  constructor() {
    effect(() => {
      const data = this.groupData();
      if (data) {
        // Set initial active category for 'Effective Members' tab
        const firstWithMembers = data.memberCategories.find(c => c.count > 0);
        this.activeCategory.set(firstWithMembers || data.memberCategories[0] || null);
        
        // Set initial active category for 'Group Definition' tab
        if (data.definitionCategories) {
            const firstDefWithMembers = data.definitionCategories.find(c => c.count > 0);
            this.activeDefinitionCategory.set(firstDefWithMembers || data.definitionCategories[0] || null);
        }
      } else {
        this.activeCategory.set(null);
        this.activeDefinitionCategory.set(null);
      }
    }, { allowSignalWrites: true });
  }
}
