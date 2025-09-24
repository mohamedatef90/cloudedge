import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';

interface ContextProfile {
  id: string;
  name: string;
  isSystemDefined: boolean;
  attributes: string;
  description: string;
  tags: number;
  whereUsed: number;
  status: 'Success';
}

interface Attribute {
    type: string;
    name: string;
    subAttributes: string;
}

@Component({
  selector: 'app-attributes-modal',
  templateUrl: './attributes-modal.component.html',
  styleUrls: ['./attributes-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class AttributesModalComponent {
  isOpen = input.required<boolean>();
  profile = input<ContextProfile | null>();
  close = output<void>();

  attributes = computed<Attribute[]>(() => {
    if (!this.profile()) {
      return [];
    }
    // Based on the image, we'll create a single attribute entry.
    // In a real scenario, this logic might be more complex if `profile.attributes` was an array or object.
    return [{
      type: 'App ID',
      name: this.profile()!.attributes,
      subAttributes: '',
    }];
  });

  attributeCount = computed(() => this.attributes().length);

  onClose(): void {
    this.close.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
