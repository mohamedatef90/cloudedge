import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';
import { GroupData, MemberCategory } from '../../firewall-groups.component';

@Component({
  selector: 'app-view-members-modal',
  templateUrl: './view-members-modal.component.html',
  styleUrls: ['./view-members-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class ViewMembersModalComponent {
  isOpen = input.required<boolean>();
  groupData = input<GroupData | null>();
  close = output<void>();

  activeCategory = signal<MemberCategory | null>(null);

  constructor() {
    effect(() => {
        const data = this.groupData();
        if (data?.memberCategories) {
            const firstWithMembers = data.memberCategories.find(c => c.count > 0);
            this.activeCategory.set(firstWithMembers || data.memberCategories[0] || null);
        }
    }, { allowSignalWrites: true });
  }

  onClose(): void {
    this.close.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}