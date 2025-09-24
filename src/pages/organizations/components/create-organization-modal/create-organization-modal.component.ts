import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';

// In a real app this would be in a shared types file.
interface Organization {
  id: string;
  name: string;
  creationDate: string;
  description: string;
}

@Component({
  selector: 'app-create-organization-modal',
  templateUrl: './create-organization-modal.component.html',
  styleUrls: ['./create-organization-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent]
})
export class CreateOrganizationModalComponent {
  isOpen = input.required<boolean>();
  organizationToEdit = input<Organization | null>(null);
  
  close = output<void>();
  create = output<{ name: string, description: string }>();
  update = output<Organization>();

  name = signal('');
  description = signal('');

  isEditMode = computed(() => !!this.organizationToEdit());

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const org = this.organizationToEdit();
        if (org) {
          this.name.set(org.name);
          this.description.set(org.description);
        } else {
          this.name.set('');
          this.description.set('');
        }
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.name().trim()) {
      const org = this.organizationToEdit();
      if (this.isEditMode() && org) {
        this.update.emit({
          ...org,
          name: this.name(),
          description: this.description(),
        });
      } else {
        this.create.emit({ name: this.name(), description: this.description() });
      }
    }
  }

  onBackdropClick(): void {
    this.onClose();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
