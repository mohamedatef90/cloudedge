
import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewayRulesComponent } from './components/gateway-rules/gateway-rules.component';
import { IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'app-gateway-firewall',
  templateUrl: './gateway-firewall.component.html',
  styleUrls: ['./gateway-firewall.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GatewayRulesComponent, IconComponent],
  host: {
    '(document:mousedown)': 'onGlobalClick($event)',
  },
})
export class GatewayFirewallComponent {
  isActionsMenuOpen = signal(false);
  actionsMenuRef = viewChild<ElementRef>('actionsMenuRef');
  actionsButtonRef = viewChild<ElementRef>('actionsButtonRef');

  onGlobalClick(event: MouseEvent): void {
      if (
          this.isActionsMenuOpen() &&
          this.actionsMenuRef() && !this.actionsMenuRef()!.nativeElement.contains(event.target as Node) &&
          this.actionsButtonRef() && !this.actionsButtonRef()!.nativeElement.contains(event.target as Node)
      ) {
          this.isActionsMenuOpen.set(false);
      }
  }
}
