

import { ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';

@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  // FIX: Replaced @HostListener with the host property for better component encapsulation.
  host: {
    '(document:mousedown)': 'onGlobalClick($event)',
  },
})
export class DropdownButtonComponent {
  label = input.required<string>();
  options = input.required<string[]>();
  disabled = input<boolean>(false);
  select = output<string>();

  isOpen = signal(false);
  
  wrapperRef = viewChild<ElementRef>('wrapperRef');

  onGlobalClick(event: MouseEvent): void {
    if (this.wrapperRef() && !this.wrapperRef()!.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggle(): void {
    if (!this.disabled()) {
      this.isOpen.update(v => !v);
    }
  }

  onSelect(option: string): void {
    this.select.emit(option);
    this.isOpen.set(false);
  }
}
