
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../components/icon/icon.component';
import { ToggleSwitchComponent } from '../../../distributed-firewall/components/toggle-switch/toggle-switch.component';
import { DashboardWidgetVisibility } from '../../../../services/dashboard-state.service';

@Component({
  selector: 'app-customize-dashboard-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ToggleSwitchComponent],
  templateUrl: './customize-dashboard-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeDashboardModalComponent {
  isOpen = input.required<boolean>();
  currentVisibility = input.required<DashboardWidgetVisibility>();

  close = output<void>();
  save = output<DashboardWidgetVisibility>();

  // Using a local signal for form state
  visibilityState = signal<DashboardWidgetVisibility>({
    stats: true,
    topVms: true,
    auditTrail: true,
    securityScore: true,
    networkStatus: true,
    helpfulResources: true,
  });
  
  // A map for easier iteration in the template
  widgetConfig: { key: keyof DashboardWidgetVisibility, label: string }[] = [
    { key: 'stats', label: 'Stats Grid' },
    { key: 'topVms', label: 'Top VMs by Resource Usage' },
    { key: 'auditTrail', label: 'Audit Trail' },
    { key: 'securityScore', label: 'Security Score' },
    { key: 'networkStatus', label: 'Network Status' },
    { key: 'helpfulResources', label: 'Helpful Resources' },
  ];

  constructor() {
    effect(() => {
      // When the modal is opened and input changes, reset local state
      if (this.isOpen()) {
        this.visibilityState.set({ ...this.currentVisibility() });
      }
    });
  }

  onSave(): void {
    this.save.emit(this.visibilityState());
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  toggleWidget(key: keyof DashboardWidgetVisibility, enabled: boolean): void {
    this.visibilityState.update(state => ({ ...state, [key]: enabled }));
  }
}
