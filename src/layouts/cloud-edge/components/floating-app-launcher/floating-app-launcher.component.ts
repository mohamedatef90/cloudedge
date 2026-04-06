

import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output } from '@angular/core';
import { AppLauncherData } from '../../../../types';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-floating-app-launcher',
  templateUrl: './floating-app-launcher.component.html',
  styleUrls: ['./floating-app-launcher.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  // FIX: Replaced @HostListener with the host property for better component encapsulation.
  host: {
    '(document:keydown.escape)': 'onEscapeKey()',
  },
})
export class FloatingAppLauncherComponent {
  isOpen = input.required<boolean>();
  launcherData = input.required<AppLauncherData>();
  close = output<void>();

  elementRef = inject(ElementRef);

  onClose() {
    this.close.emit();
  }

  onEscapeKey() {
    if (this.isOpen()) {
      this.onClose();
    }
  }
}