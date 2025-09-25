import { ChangeDetectionStrategy, Component, output, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { Service } from '../../firewall-services.component';

@Component({
  selector: 'app-add-service-modal',
  templateUrl: './add-service-modal.component.html',
  styleUrls: ['./add-service-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
  standalone: true,
})
export class AddServiceModalComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  save = output<Omit<Service, 'id' | 'icon' | 'description' | 'tags' | 'whereUsedCount' | 'status'>>();

  name = signal('');
  protocol = signal<'TCP' | 'UDP' | 'Any'>('TCP');
  destinationPort = signal('');
  
  handleSave(): void {
    if (!this.name().trim() || !this.destinationPort().trim()) {
      // In a real app, show a more user-friendly error
      console.error('Service Name and Port are required.');
      return;
    }
    this.save.emit({
      name: this.name(),
      protocol: this.protocol(),
      destinationPort: this.destinationPort(),
    });
    this.handleClose();
  }
  
  handleClose(): void {
    this.name.set('');
    this.protocol.set('TCP');
    this.destinationPort.set('');
    this.close.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
