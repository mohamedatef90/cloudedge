
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../../components/icon/icon.component';

export interface GatewayInfo {
  id: string;
  name: string;
  ipAddress: string;
  status: 'Connected' | 'Disconnected';
}

@Component({
  selector: 'app-add-edit-gateway-modal',
  templateUrl: './add-edit-gateway-modal.component.html',
  styleUrls: ['./add-edit-gateway-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class AddEditGatewayModalComponent {
  isOpen = input.required<boolean>();
  gatewayToEdit = input<GatewayInfo | null>();

  close = output<void>();
  save = output<GatewayInfo>();

  gatewayData = signal<Omit<GatewayInfo, 'id'>>({ name: '', ipAddress: '', status: 'Connected' });
  
  isEditMode = computed(() => !!this.gatewayToEdit());

  constructor() {
    effect(() => {
      const gateway = this.gatewayToEdit();
      if (this.isOpen() && gateway) {
        this.gatewayData.set({ name: gateway.name, ipAddress: gateway.ipAddress, status: gateway.status });
      } else {
        this.gatewayData.set({ name: '', ipAddress: '', status: 'Connected' });
      }
    });
  }

  onSave(): void {
    const data = this.gatewayData();
    if (data.name.trim() && data.ipAddress.trim()) {
      const outputData: GatewayInfo = {
        id: this.gatewayToEdit()?.id || `gw-${Date.now()}`,
        ...data
      };
      this.save.emit(outputData);
    }
  }
}
