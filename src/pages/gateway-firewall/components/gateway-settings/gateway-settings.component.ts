
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { MOCK_GATEWAY_SETTINGS } from '../../mock-data';
import { GatewaySetting } from '../../types';
import { DropdownButtonComponent } from '../dropdown-button/dropdown-button.component';

@Component({
  selector: 'app-gateway-settings',
  templateUrl: './gateway-settings.component.html',
  styleUrls: ['./gateway-settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, FormsModule, ToggleSwitchComponent, DropdownButtonComponent],
})
export class GatewaySettingsComponent {
  settings = signal<GatewaySetting[]>(MOCK_GATEWAY_SETTINGS);
  selectedIds = signal<string[]>([]);
  filter = signal('');
  turnOnOffOptions = ['Gateway Firewall', 'Identity Firewall', 'Both Features'];

  filteredSettings = computed(() => {
    const term = this.filter().toLowerCase();
    if (!term) return this.settings();
    return this.settings().filter(s => s.gatewayName.toLowerCase().includes(term));
  });

  isAllSelected = computed(() => {
    const filtered = this.filteredSettings();
    return this.selectedIds().length === filtered.length && filtered.length > 0;
  });

  handleBulkAction(option: string, action: 'on' | 'off'): void {
    const selected = this.selectedIds();
    if (selected.length === 0) return;

    this.settings.update(currentSettings =>
      currentSettings.map(s => {
        if (selected.includes(s.id)) {
          const newValue = action === 'on';
          const updatedSetting = { ...s };
          if (option === 'Gateway Firewall' || option === 'Both Features') {
            updatedSetting.gatewayFirewallEnabled = newValue;
          }
          if (option === 'Identity Firewall' || option === 'Both Features') {
            updatedSetting.identityFirewallEnabled = newValue;
          }
          return updatedSetting;
        }
        return s;
      })
    );
    this.selectedIds.set([]);
  }

  handleToggle(id: string, field: 'gatewayFirewallEnabled' | 'identityFirewallEnabled'): void {
    this.settings.update(currentSettings =>
      currentSettings.map(s => s.id === id ? { ...s, [field]: !s[field] } : s)
    );
  }

  handleSelectOne(id: string, checked: boolean): void {
    this.selectedIds.update(ids => {
      if (checked) {
        return [...ids, id];
      } else {
        return ids.filter(i => i !== id);
      }
    });
  }
  
  handleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedIds.set(this.filteredSettings().map(s => s.id));
    } else {
      this.selectedIds.set([]);
    }
  }
}
