

import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { AppLauncherData } from '../../../../types';
import { IconComponent } from '../../../../components/icon/icon.component';
import { FloatingAppLauncherComponent } from '../floating-app-launcher/floating-app-launcher.component';

@Component({
  selector: 'app-cloud-edge-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink, FloatingAppLauncherComponent],
  // FIX: Replaced @HostListener with the host property for better component encapsulation.
  host: {
    '(document:mousedown)': 'onGlobalClick($event)',
  },
})
export class CloudEdgeTopBarComponent {
  launcherData = input.required<AppLauncherData>();
  isSidebarCollapsed = input.required<boolean>();
  toggleSidebar = output<void>();

  private authService = inject(AuthService);
  user = this.authService.user;

  userMenuOpen = signal(false);
  appLauncherOpen = signal(false);

  userMenuRef = viewChild<ElementRef>('userMenuRef');
  userMenuButtonRef = viewChild<ElementRef>('userMenuButtonRef');
  appLauncherRef = viewChild<FloatingAppLauncherComponent>('appLauncherRef');
  appLauncherButtonRef = viewChild<ElementRef>('appLauncherButtonRef');

  onGlobalClick(event: MouseEvent): void {
    const target = event.target as Node;

    const userMenu = this.userMenuRef();
    const userMenuButton = this.userMenuButtonRef();
    if (this.userMenuOpen() && userMenu && !userMenu.nativeElement.contains(target) && userMenuButton && !userMenuButton.nativeElement.contains(target)) {
      this.userMenuOpen.set(false);
    }

    const appLauncher = this.appLauncherRef();
    const appLauncherButton = this.appLauncherButtonRef();
    if (this.appLauncherOpen() && appLauncher && !appLauncher.elementRef.nativeElement.contains(target) && appLauncherButton && !appLauncherButton.nativeElement.contains(target)) {
      this.appLauncherOpen.set(false);
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  toggleAppLauncher(): void {
    this.appLauncherOpen.update(v => !v);
  }

  closeMenus(): void {
    this.userMenuOpen.set(false);
    this.appLauncherOpen.set(false);
  }
}
