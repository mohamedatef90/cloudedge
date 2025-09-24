import { ChangeDetectionStrategy, Component, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { Service } from '../../types';

@Component({
  selector: 'app-edit-services-modal',
  templateUrl: './edit-services-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class EditServicesModalComponent {
  isOpen = input.required<boolean>();
  currentServices = input.required<Service[]>();
  ruleName = input.required<string>();
  availableServices = input.required<Service[]>();
  
  close = output<void>();
  save = output<Service[]>();

  selected = signal<Service[]>([]);
  searchTerm = signal('');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.selected.set(this.currentServices());
        this.searchTerm.set('');
      }
    });
  }

  filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.availableServices().filter(s => s.name.toLowerCase().includes(term));
  });

  toggleService(service: Service): void {
    this.selected.update(prev => 
      prev.some(s => s.name === service.name)
        ? prev.filter(s => s.name !== service.name)
        : [...prev, service]
    );
  }

  handleSave(): void {
    this.save.emit(this.selected());
  }

  isSelected(service: Service): boolean {
    return this.selected().some(s => s.name === service.name);
  }
}
