import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  standalone: true,
  host: {
    '(document:keydown.escape)': 'onEscapeKey()',
  },
})
export class FilterPanelComponent {
  isOpen = input.required<boolean>();
  title = input<string>('Filters');

  close = output<void>();
  apply = output<void>();
  clear = output<void>();

  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close.emit();
    }
  }

  onBackdropClick(): void {
    this.close.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onApply(): void {
    this.apply.emit();
  }

  onClear(): void {
    this.clear.emit();
  }
}
