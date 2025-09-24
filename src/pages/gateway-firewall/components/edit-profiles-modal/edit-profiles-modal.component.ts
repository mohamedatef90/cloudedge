
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-edit-profiles-modal',
  templateUrl: './edit-profiles-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfilesModalComponent {
  isOpen = input.required<boolean>();
  currentProfile = input.required<string>();
  ruleName = input.required<string>();
  availableProfiles = input.required<string[]>();
  
  close = output<void>();
  save = output<string>();

  selected = signal('');
  searchTerm = signal('');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.selected.set(this.currentProfile());
        this.searchTerm.set('');
      }
    });
  }

  filteredProfiles = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.availableProfiles().filter(p => p.toLowerCase().includes(term));
  });

  handleSave(): void {
    if (this.selected()) {
        this.save.emit(this.selected());
        this.close.emit();
    }
  }
}
