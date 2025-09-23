
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLauncherData } from '../../../../types';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-floating-app-launcher',
  templateUrl: './floating-app-launcher.component.html',
  styleUrls: ['./floating-app-launcher.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
})
export class FloatingAppLauncherComponent {
  isOpen = input.required<boolean>();
  launcherData = input.required<AppLauncherData>();
  close = output<void>();

  elementRef = inject(ElementRef);

  onClose() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen()) {
      this.onClose();
    }
  }
}
