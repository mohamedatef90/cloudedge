

import { ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../components/icon/icon.component';

type RuleAction = 'Allow' | 'Drop' | 'Reject';

@Component({
  selector: 'app-action-dropdown',
  templateUrl: './action-dropdown.component.html',
  styleUrls: ['./action-dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  // FIX: Replaced @HostListener with the host property for better component encapsulation.
  host: {
    '(document:mousedown)': 'onGlobalClick($event)',
  },
})
export class ActionDropdownComponent {
  currentAction = input.required<RuleAction>();
  actionChange = output<RuleAction>();

  isOpen = signal(false);
  actions: RuleAction[] = ['Allow', 'Drop', 'Reject'];
  
  dropdownRef = viewChild<ElementRef>('dropdownRef');
  buttonRef = viewChild<ElementRef>('buttonRef');

  onGlobalClick(event: MouseEvent): void {
    if (
      this.isOpen() &&
      this.dropdownRef() && !this.dropdownRef()!.nativeElement.contains(event.target) &&
      this.buttonRef() && !this.buttonRef()!.nativeElement.contains(event.target)
    ) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  selectAction(action: RuleAction): void {
    this.actionChange.emit(action);
    this.isOpen.set(false);
  }

  getActionClasses(action: RuleAction): { text: string, bg: string } {
    switch (action) {
      case 'Allow': return { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' };
      case 'Drop': return { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' };
      case 'Reject': return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' };
    }
  }
}
