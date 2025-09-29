
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticRouteFirewallComponent } from './components/static-route-firewall/static-route-firewall.component';
import { StaticRouteComponent } from './components/static-route/static-route.component';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, StaticRouteFirewallComponent, StaticRouteComponent],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesComponent {
  activeTab = signal<'firewall' | 'route'>('firewall');

  tabs = [
    { id: 'firewall', name: 'Static Route Firewall' },
    { id: 'route', name: 'Static Route' },
  ];
}
