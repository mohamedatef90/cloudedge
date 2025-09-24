import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-add-policy-modal',
  templateUrl: './add-policy-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class AddPolicyModalComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  save = output<string>();

  policyName = signal('');

  handleSave(): void {
    if (this.policyName().trim()) {
      this.save.emit(this.policyName());
      this.policyName.set('');
    }
  }

  handleClose(): void {
    this.policyName.set('');
    this.close.emit();
  }
}
